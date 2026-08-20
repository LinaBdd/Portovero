from datetime import datetime, timedelta
from http.client import HTTPException

from fastapi import status
from sqlalchemy import case,func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.payment import Payment
from app.services.payment import get_payment_by_order, update_payment
from app.schemas.payment import PaymentUpdate
from app.schemas.admin import (
    AdminProductColorCreate,
    AdminProductCreate,
    AdminProductVariantCreate,
    AdminProductImageCreate,
)

from app.models.product_color import ProductColor
from app.models.product_variant import ProductVariant
from app.models.product_image import ProductImage
from app.models.product_category import ProductCategory

from app.services.product import (
    generate_unique_slug,
    generate_sku
)
from app.models.category import Category


def dashboard(db: Session):

    # =========================
    # KPI
    # =========================

    total_users = (
        db.query(User)
        .count()
    )

    total_products = (
        db.query(Product)
        .count()
    )

    total_orders = (
        db.query(Order)
        .count()
    )

    total_payments = (
        db.query(Payment)
        
        .count()
    )

    pending_orders = (
        db.query(Order)
        .filter(Order.status == "pending")
        .count()
    )

    # =========================
    # Revenue
    # =========================

    revenue = (
        db.query(func.coalesce(func.sum(Order.total), 0))
        .filter(Order.payment_status == "paid")
        .scalar()
    )

    # =========================
    # Commandes par statut
    # =========================

    order_status_rows = (
        db.query(
            Order.status,
            func.count(Order.id),
        )
        .group_by(Order.status)
        .all()
    )

    order_statuses = [
        {
            "status": status,
            "count": count,
        }
        for status, count in order_status_rows
    ]

    # =========================
    # Paiements par statut
    # =========================

    payment_status_rows = (
        db.query(
            Payment.status,
            func.count(Payment.id),
        )
        .group_by(Payment.status)
        .all()
    )

    payment_statuses = [
        {
            "status": status,
            "count": count,
        }
        for status, count in payment_status_rows
    ]

    # =========================
    # Statistiques mensuelles
    # =========================

    monthly_rows = (
        db.query(
            func.date_trunc(
                "month",
                Order.created_at,
            ).label("month"),

            func.count(Order.id).label("orders"),

            func.coalesce(
                func.sum(
                    case(
                        (
                            Order.payment_status == "paid",
                            Order.total,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("revenue"),
        )
        .group_by(
            func.date_trunc(
                "month",
                Order.created_at,
            )
        )
        .order_by(
            func.date_trunc(
                "month",
                Order.created_at,
            )
        )
        .all()
    )

    monthly_stats = [
        {
            "month": month.strftime("%Y-%m"),
            "orders": orders,
            "revenue": float(revenue),
        }
        for month, orders, revenue in monthly_rows
    ]

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_payments": total_payments,
        "pending_orders": pending_orders,
        "revenue": float(revenue),

        "monthly_stats": monthly_stats,
        "order_statuses": order_statuses,
        "payment_statuses": payment_statuses,
    }


def get_users(db: Session):
    return (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )


def get_orders(db: Session):
    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_payments(db: Session):
    return (
        db.query(Payment)
        .order_by(Payment.created_at.desc())
        .all()
    )



def update_order_payment_status(
    db: Session,
    order_id: int,
    status: str,
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        return None


    # Mise à jour du paiement associé
    payment = get_payment_by_order(
        db,
        order_id,
    )

    if payment:
        update_payment(
            db,
            payment.id,
            PaymentUpdate(
                status=status,
            ),
        )


    # Synchronisation avec la commande
    order.payment_status = status

    db.commit()
    db.refresh(order)

    return order

def create_product_admin(
    db: Session,
    data: AdminProductCreate,
) -> Product:

    try:

        # =========================
        # PRODUCT
        # =========================

        product = Product(
            name=data.name,
            slug=generate_unique_slug(
                db,
                data.name,
            ),
            sku=generate_sku(db),

            description=data.description,

            base_price=data.base_price,
            compare_at_price=data.compare_at_price,

            stock=data.stock,
            weight=data.weight,

            gender=data.gender,

            is_active=data.is_active,
            is_featured=data.is_featured,
            is_new=data.is_new,
        )

        db.add(product)

        # Permet d'obtenir product.id
        db.flush()


        # =========================
        # CATEGORY
        # =========================

        if data.category_id is not None:

            category = (
                db.query(Category)
                .filter(
                    Category.id == data.category_id
                )
                .first()
            )

            if not category:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Category not found.",
                )

            product_category = ProductCategory(
                product_id=product.id,
                category_id=data.category_id,
            )

            db.add(product_category)


        # =========================
        # COLORS
        # =========================

        product_colors = {}

        for color_data in data.colors:

            product_color = ProductColor(
                product_id=product.id,
                color_id=color_data.color_id,
            )

            db.add(product_color)

            db.flush()

            product_colors[
                color_data.color_id
            ] = product_color


            # =========================
            # IMAGES DE LA COULEUR
            # =========================

            for image_data in color_data.images:

                product_image = ProductImage(
                    product_color_id=product_color.id,

                    image_url=image_data.url,

                    alt=image_data.alt,

                    position=image_data.position,

                    is_primary=image_data.is_primary,
                )

                db.add(product_image)


        # =========================
        # VARIANTS
        # =========================

        for variant_data in data.variants:

            product_color = product_colors.get(
                variant_data.color_id
            )

            if not product_color:

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Color {variant_data.color_id} "
                        f"must be defined in colors."
                    ),
                )


            product_variant = ProductVariant(
                product_color_id=product_color.id,

                size_id=variant_data.size_id,

                sku=(
                    f"{product.sku}-"
                    f"{variant_data.color_id}-"
                    f"{variant_data.size_id}"
                ),

                stock=variant_data.stock,

                price=variant_data.price,

                old_price=variant_data.old_price,

                is_active=variant_data.is_active,
            )

            db.add(product_variant)


        # =========================
        # COMMIT
        # =========================

        db.commit()

        db.refresh(product)

        return product


    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise