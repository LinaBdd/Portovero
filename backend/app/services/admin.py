

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
import re
import uuid
from app.models.product_image import ProductImage
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.order import Order
from app.models.payment import Payment
from app.models.product import Product
from app.models.product_category import ProductCategory
from app.models.product_color import ProductColor
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant
from app.models.user import User
from app.schemas.admin import (
    AdminProductCreate,
    AdminProductUpdate,
    DashboardStats,
    ImageUpdate,
    MonthlyStats,
    PaymentStats,
    StatusStats,
    StockAlertProduct,
)


ZERO = Decimal("0.00")


def _decimal(value: Decimal | int | float | None) -> Decimal:
    """Convert SQL numeric values without introducing float rounding."""
    return Decimal(str(value)) if value is not None else ZERO


def _slugify(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return value or "product"


def _unique_slug(db: Session, name: str, *, exclude_product_id: int | None = None) -> str:
    base = _slugify(name)
    candidate = base
    suffix = 2
    while True:
        query = db.query(Product.id).filter(Product.slug == candidate)
        if exclude_product_id is not None:
            query = query.filter(Product.id != exclude_product_id)
        if query.first() is None:
            return candidate
        candidate = f"{base}-{suffix}"
        suffix += 1


def _product_sku(name: str) -> str:
    prefix = re.sub(r"[^A-Za-z0-9]", "", name)[:3].upper() or "PRO"
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"


def _variant_sku(product_sku: str, color_id: int, size_id: int) -> str:
    return f"{product_sku}-{color_id}-{size_id}-{uuid.uuid4().hex[:4].upper()}"


def _product_options():
    return (
        selectinload(Product.categories),
        selectinload(Product.colors).selectinload(ProductColor.images),
        selectinload(Product.colors).selectinload(ProductColor.variants),
    )


def _get_product_or_404(db: Session, product_id: int) -> Product:
    product = (
        db.query(Product)
        .options(*_product_options())
        .filter(Product.id == product_id)
        .first()
    )
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

def _set_images(product_color, images):
    product_color.images.clear()

    for data in images:
        image = ProductImage(
            image_url=data.url,
            alt=data.alt,
            position=data.position,
            is_primary=data.is_primary,
        )
        product_color.images.append(image)


def _set_variants(
    db: Session,
    product: Product,
    product_color: ProductColor,
    variants,
) -> None:
    """
    Replace only the supplied color's variants.

    Existing variants keep their SKU.
    New variants receive a generated SKU.
    """

    current = {
        variant.id: variant
        for variant in product_color.variants
    }

    incoming_ids: set[int] = set()
    seen_sizes: set[int] = set()

    for data in variants:

        # --------------------------------------------------------
        # Prevent duplicate size for the same color
        # --------------------------------------------------------

        if data.size_id in seen_sizes:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "A product colour cannot contain "
                    "the same size twice"
                ),
            )

        seen_sizes.add(data.size_id)

        # --------------------------------------------------------
        # Existing variant
        # --------------------------------------------------------

        if data.id is not None:

            variant = current.get(data.id)

            if variant is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Variant {data.id} does not belong "
                        "to this product colour"
                    ),
                )

            incoming_ids.add(data.id)

        # --------------------------------------------------------
        # New variant
        # --------------------------------------------------------

        else:

            variant = ProductVariant(
                product_color=product_color,
                sku=_variant_sku(
                    product.sku,
                    product_color.color_id,
                    data.size_id,
                ),
            )

            product_color.variants.append(variant)

        # --------------------------------------------------------
        # Update variant data
        # --------------------------------------------------------

        variant.size_id = data.size_id
        variant.stock = data.stock
        variant.price = data.price
        variant.old_price = data.old_price
        variant.is_active = data.is_active

    # ------------------------------------------------------------
    # Remove variants not included in the explicit update
    # ------------------------------------------------------------

    for variant_id, variant in current.items():

        if variant_id not in incoming_ids:
            product_color.variants.remove(variant)





def _sync_product_stock(product: Product) -> None:
    """
    ProductVariant.stock is the source of truth.

    Product.stock is only a cached total used by
    legacy code/read paths.
    """

    product.stock = sum(
        max(0, int(variant.stock or 0))
        for color in product.colors
        for variant in color.variants
        if variant.is_active
    )

def create_product_admin(db: Session, payload: AdminProductCreate) -> Product:
    """Create a product, its categories, colours, images and variants atomically."""
    color_ids = [item.color_id for item in payload.colors]
    if len(color_ids) != len(set(color_ids)):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="A colour was supplied twice")

    product = Product(
        name=payload.name,
        slug=_unique_slug(db, payload.name),
        sku=_product_sku(payload.name),
        description=payload.description,
        base_price=payload.base_price,
        compare_at_price=payload.compare_at_price,
        cost_price=payload.cost_price,
        stock=0,
        weight=payload.weight,
        gender=payload.gender,
        is_active=payload.is_active,
        is_featured=payload.is_featured,
        is_new=payload.is_new,
    )
    db.add(product)

    if payload.category_id is not None:
        product.categories.append(ProductCategory(category_id=payload.category_id))

    colors_by_id: dict[int, ProductColor] = {}
    for color_data in payload.colors:
        product_color = ProductColor(color_id=color_data.color_id)
        product.colors.append(product_color)
        colors_by_id[color_data.color_id] = product_color
        _set_images(product_color, color_data.images)

    variant_keys: set[tuple[int, int]] = set()
    for variant_data in payload.variants:
        variant_key = (variant_data.color_id, variant_data.size_id)
        if variant_key in variant_keys:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="The same colour and size combination was supplied twice",
            )
        variant_keys.add(variant_key)
        product_color = colors_by_id.get(variant_data.color_id)
        if product_color is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Variant colour {variant_data.color_id} is missing from colors",
            )
        product_color.variants.append(
            ProductVariant(
                size_id=variant_data.size_id,
                sku=variant_data.sku or _variant_sku(product.sku, variant_data.color_id, variant_data.size_id),
                stock=variant_data.stock,
                price=variant_data.price,
                old_price=variant_data.old_price,
                is_active=variant_data.is_active,
            )
        )

    _sync_product_stock(product)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise
    return _get_product_or_404(db, product.id)


def update_product_admin(
    db: Session,
    product_id: int,
    payload: AdminProductUpdate,
) -> Product:
    """
    Update a product atomically.

    - Scalar fields are updated only when supplied.
    - Nested collections are modified only when explicitly supplied.
    - Existing ProductColor rows are reused whenever possible.
    - ProductVariant.stock remains the source of truth.
    """

    product = _get_product_or_404(db, product_id)

    # ============================================================
    # 1. UPDATE SCALAR FIELDS
    # ============================================================

    values = payload.model_dump(
        exclude_unset=True,
        exclude={
            "category_ids",
            "colors",
            "stock",
        },
    )

    # Name + slug
    if "name" in values:
        new_name = values.pop("name")

        if new_name != product.name:
            product.name = new_name
            product.slug = _unique_slug(
                db,
                new_name,
                exclude_product_id=product.id,
            )

    # Other scalar fields
    for field, value in values.items():
        setattr(product, field, value)

    # ============================================================
    # 2. UPDATE CATEGORIES
    # ============================================================

    if "category_ids" in payload.model_fields_set:

        category_ids = payload.category_ids or []

        # Prevent duplicates
        if len(category_ids) != len(set(category_ids)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="A category was supplied twice",
            )

        product.categories[:] = [
            ProductCategory(category_id=category_id)
            for category_id in category_ids
        ]

    # ============================================================
    # 3. UPDATE COLORS
    # ============================================================

    if "colors" in payload.model_fields_set:

        color_updates = payload.colors or []

        # --------------------------------------------------------
        # Validate duplicate color IDs in payload
        # --------------------------------------------------------

        color_ids = [
            item.color_id
            for item in color_updates
        ]

        if len(color_ids) != len(set(color_ids)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="The same colour was supplied twice",
            )

        # --------------------------------------------------------
        # Validate duplicate ProductColor row IDs
        # --------------------------------------------------------

        incoming_row_ids = [
            item.id
            for item in color_updates
            if item.id is not None
        ]

        if len(incoming_row_ids) != len(set(incoming_row_ids)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="A product colour was supplied twice",
            )

        # --------------------------------------------------------
        # Existing colors
        # --------------------------------------------------------

        current_colors = list(product.colors)

        current_by_id = {
            color.id: color
            for color in current_colors
        }

        current_by_color_id = {
            color.color_id: color
            for color in current_colors
        }

        kept_color_ids: set[int] = set()

        # ========================================================
        # Process incoming colors
        # ========================================================

        for color_data in color_updates:

            product_color: ProductColor | None = None

            # ----------------------------------------------------
            # CASE A:
            # Existing ProductColor identified by its row ID
            # ----------------------------------------------------

            if color_data.id is not None:

                product_color = current_by_id.get(
                    color_data.id
                )

                if product_color is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=(
                            f"Product colour {color_data.id} "
                            "does not belong to this product"
                        ),
                    )

                # If changing the color_id, make sure another
                # ProductColor does not already use that color.
                existing_color = current_by_color_id.get(
                    color_data.color_id
                )

                if (
                    existing_color is not None
                    and existing_color.id != product_color.id
                ):
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=(
                            f"Colour {color_data.color_id} "
                            "is already assigned to this product"
                        ),
                    )

                product_color.color_id = color_data.color_id

                kept_color_ids.add(product_color.id)

            # ----------------------------------------------------
            # CASE B:
            # No ProductColor row ID was supplied
            #
            # IMPORTANT:
            # First search by color_id.
            # Only create a row if it truly doesn't exist.
            # ----------------------------------------------------

            else:

                product_color = current_by_color_id.get(
                    color_data.color_id
                )

                if product_color is None:

                    product_color = ProductColor(
                        product_id=product.id,
                        color_id=color_data.color_id,
                    )

                    product.colors.append(product_color)

                else:
                    # Existing row -> DO NOT INSERT another one
                    kept_color_ids.add(product_color.id)

            # ----------------------------------------------------
            # Images
            # ----------------------------------------------------

            if color_data.images is not None:
                _set_images(
                    product_color,
                    color_data.images,
                )

            # ----------------------------------------------------
            # Variants
            # ----------------------------------------------------

            if color_data.variants is not None:
                _set_variants(
                    db,
                    product,
                    product_color,
                    color_data.variants,
                )

            # New ProductColor rows don't have an ID until flush.
            # Existing ones already have one.
            if product_color.id is not None:
                kept_color_ids.add(product_color.id)

        # ========================================================
        # Remove colors omitted from the explicit colors payload
        # ========================================================

        for color in current_colors:

            if (
                color.id is not None
                and color.id not in kept_color_ids
            ):
                product.colors.remove(color)

    # ============================================================
    # 4. SYNCHRONIZE PRODUCT STOCK
    # ============================================================

    _sync_product_stock(product)

    # ============================================================
    # 5. COMMIT ATOMICALLY
    # ============================================================

    try:
        db.commit()

    except Exception:
        db.rollback()
        raise

    # ============================================================
    # 6. RETURN FRESH PRODUCT
    # ============================================================

    return _get_product_or_404(
        db,
        product.id,
    )



def dashboard(
    db: Session,
    low_stock_threshold: int = 5,
) -> DashboardStats:
    """
    Dashboard statistics.

    Rules:
    - Revenue = sum of orders whose payment_status is "paid"
      and whose order status is not "cancelled".
    - Product stock = sum of ACTIVE ProductVariant.stock.
    - Product.stock is NOT used as source of truth.
    - Stock alerts are based on the same calculated stock.
    """

    # ============================================================
    # 1. BASIC COUNTS
    # ============================================================

    total_users = (
        db.query(func.count(User.id))
        .scalar()
        or 0
    )

    total_products = (
        db.query(func.count(Product.id))
        .scalar()
        or 0
    )

    active_products = (
        db.query(func.count(Product.id))
        .filter(Product.is_active.is_(True))
        .scalar()
        or 0
    )

    inactive_products = total_products - active_products

    total_orders = (
        db.query(func.count(Order.id))
        .scalar()
        or 0
    )

    confirmed_orders = (
        db.query(func.count(Order.id))
        .filter(Order.status == "confirmed")
        .scalar()
        or 0
    )

    pending_orders = (
        db.query(func.count(Order.id))
        .filter(Order.status == "pending")
        .scalar()
        or 0
    )

    # ============================================================
    # 2. PAID ORDERS
    # ============================================================

    paid_order_filter = (
        Order.payment_status == "paid",
        Order.status != "cancelled",
    )

    paid_orders = (
        db.query(func.count(Order.id))
        .filter(*paid_order_filter)
        .scalar()
        or 0
    )

    # ============================================================
    # 3. PAYMENTS
    # ============================================================

    total_payments = (
        db.query(func.count(Payment.id))
        .scalar()
        or 0
    )

    paid_payments = (
        db.query(func.count(Payment.id))
        .filter(Payment.status == "paid")
        .scalar()
        or 0
    )

    # ============================================================
    # 4. REVENUE
    # ============================================================

    revenue_value = (
        db.query(
            func.coalesce(
                func.sum(Order.total),
                0,
            )
        )
        .filter(*paid_order_filter)
        .scalar()
    )

    revenue = _decimal(revenue_value)

    # ============================================================
    # 5. ORDER STATUSES
    # ============================================================

    order_status_rows = (
        db.query(
            Order.status.label("status"),
            func.count(Order.id).label("count"),
        )
        .group_by(Order.status)
        .order_by(Order.status)
        .all()
    )

    order_statuses = [
        StatusStats(
            status=row.status,
            count=int(row.count),
        )
        for row in order_status_rows
    ]

    # ============================================================
    # 6. PAYMENT STATUSES
    # ============================================================

    payment_status_rows = (
        db.query(
            Payment.status.label("status"),
            func.count(Payment.id).label("count"),
        )
        .group_by(Payment.status)
        .order_by(Payment.status)
        .all()
    )

    payment_statuses = [
        PaymentStats(
            status=row.status,
            count=int(row.count),
        )
        for row in payment_status_rows
    ]

    # ============================================================
    # 7. STOCK
    # ============================================================
    #
    # IMPORTANT:
    # ProductVariant.stock is the source of truth.
    #
    # We calculate stock per product from ACTIVE variants only.
    #

    stock_rows = (
        db.query(
            Product.id.label("id"),
            Product.name.label("name"),
            Product.sku.label("sku"),
            Product.cost_price.label("cost_price"),
            Product.base_price.label("base_price"),
            func.coalesce(
                func.sum(ProductVariant.stock),
                0,
            ).label("stock"),
        )
        .outerjoin(
            ProductColor,
            ProductColor.product_id == Product.id,
        )
        .outerjoin(
            ProductVariant,
            (
                ProductVariant.product_color_id
                == ProductColor.id
            )
            & ProductVariant.is_active.is_(True),
        )
        .filter(Product.is_active.is_(True))
        .group_by(
            Product.id,
            Product.name,
            Product.sku,
            Product.cost_price,
            Product.base_price,
        )
        .all()
    )

    # ============================================================
    # 8. SAFE STOCK CALCULATION
    # ============================================================

    def safe_stock(value) -> int:
        return max(
            0,
            int(value or 0),
        )

    # ============================================================
    # 9. STOCK TOTAL
    # ============================================================

    total_stock = sum(
        safe_stock(row.stock)
        for row in stock_rows
    )

    # ============================================================
    # 10. STOCK VALUES
    # ============================================================

    total_stock_value_cost = sum(
        (
            _decimal(row.cost_price)
            * safe_stock(row.stock)
        )
        for row in stock_rows
    )

    total_stock_value_sale = sum(
        (
            _decimal(row.base_price)
            * safe_stock(row.stock)
        )
        for row in stock_rows
    )

    total_potential_profit = (
        total_stock_value_sale
        - total_stock_value_cost
    )

    # ============================================================
    # 11. STOCK ALERTS
    # ============================================================

    alerts = [
        StockAlertProduct(
            id=row.id,
            name=row.name,
            sku=row.sku,
            stock=safe_stock(row.stock),
        )
        for row in stock_rows
    ]

    out_of_stock_products = [
        item
        for item in alerts
        if item.stock == 0
    ]

    low_stock_products = [
        item
        for item in alerts
        if 0 < item.stock <= low_stock_threshold
    ]

    # ============================================================
    # 12. MONTHLY REVENUE
    # ============================================================

    monthly_rows = (
        db.query(
            func.extract(
                "year",
                Order.created_at,
            ).label("year"),

            func.extract(
                "month",
                Order.created_at,
            ).label("month"),

            func.coalesce(
                func.sum(Order.total),
                0,
            ).label("revenue"),

            func.count(
                Order.id
            ).label("orders"),
        )
        .filter(*paid_order_filter)
        .group_by(
            func.extract(
                "year",
                Order.created_at,
            ),
            func.extract(
                "month",
                Order.created_at,
            ),
        )
        .all()
    )

    monthly_index = {
        (
            int(row.year),
            int(row.month),
        ): row
        for row in monthly_rows
    }

    # ============================================================
    # 13. LAST 6 MONTHS
    # ============================================================

    now = datetime.now().astimezone()

    year = now.year
    month = now.month

    monthly_stats: list[MonthlyStats] = []

    for _ in range(6):

        row = monthly_index.get(
            (year, month)
        )

        monthly_stats.append(
            MonthlyStats(
                month=f"{year:04d}-{month:02d}",

                revenue=float(
                    _decimal(row.revenue)
                    if row
                    else ZERO
                ),

                orders=(
                    int(row.orders)
                    if row
                    else 0
                ),
            )
        )

        month -= 1

        if month == 0:
            year -= 1
            month = 12

    monthly_stats.reverse()

    # ============================================================
    # 14. RETURN DASHBOARD
    # ============================================================

    return DashboardStats(

        # Users
        total_users=int(total_users),

        # Products
        total_products=int(total_products),
        active_products=int(active_products),
        inactive_products=int(inactive_products),

        # Orders
        total_orders=int(total_orders),
        confirmed_orders=int(confirmed_orders),
        pending_orders=int(pending_orders),
        paid_orders=int(paid_orders),

        # Payments
        total_payments=int(total_payments),
        paid_payments=int(paid_payments),

        # Revenue
        revenue=float(revenue),

        # Stock
        total_stock=int(total_stock),

        total_stock_value_cost=float(
            total_stock_value_cost
        ),

        total_stock_value_sale=float(
            total_stock_value_sale
        ),

        total_potential_profit=float(
            total_potential_profit
        ),

        # Alerts
        out_of_stock_count=len(
            out_of_stock_products
        ),

        low_stock_count=len(
            low_stock_products
        ),

        low_stock_threshold=low_stock_threshold,

        # Charts
        monthly_stats=monthly_stats,

        order_statuses=order_statuses,

        payment_statuses=payment_statuses,

        # Products alerts
        out_of_stock_products=out_of_stock_products,

        low_stock_products=low_stock_products,
    )


                       