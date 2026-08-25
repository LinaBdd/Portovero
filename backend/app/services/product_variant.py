from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.product_variant import ProductVariant
from app.models.product_color import ProductColor
from app.models.product import Product
from app.models.size import Size
from app.schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantUpdate,
)


# ============================================================
# SKU
# ============================================================

def generate_variant_sku(db: Session) -> str:
    last = (
        db.query(ProductVariant)
        .order_by(ProductVariant.id.desc())
        .first()
    )

    if not last:
        return "VAR-000001"

    return f"VAR-{last.id + 1:06d}"


# ============================================================
# STOCK PRODUIT
# ============================================================

def sync_product_stock(
    db: Session,
    product_id: int,
) -> Product:

    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    total_stock = (
        db.query(
            func.coalesce(
                func.sum(ProductVariant.stock),
                0,
            )
        )
        .join(
            ProductColor,
            ProductColor.id == ProductVariant.product_color_id,
        )
        .filter(
            ProductColor.product_id == product_id
        )
        .scalar()
    )

    product.stock = int(total_stock or 0)

    db.flush()

    return product


# ============================================================
# CREATE VARIANT
# ============================================================

def create_product_variant(
    db: Session,
    data: ProductVariantCreate,
) -> ProductVariant:

    product_color = db.get(
        ProductColor,
        data.product_color_id,
    )

    if not product_color:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product color not found.",
        )

    size = db.get(
        Size,
        data.size_id,
    )

    if not size:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Size not found.",
        )

    existing = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_color_id
            == data.product_color_id,
            ProductVariant.size_id
            == data.size_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A variant already exists for "
                "this color and size."
            ),
        )

    if data.stock < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock cannot be negative.",
        )

    variant = ProductVariant(
        product_color_id=data.product_color_id,
        size_id=data.size_id,
        sku=generate_variant_sku(db),
        stock=data.stock,
        price=data.price,
        old_price=data.old_price,
        is_active=data.is_active,
    )

    db.add(variant)

    db.flush()

    sync_product_stock(
        db,
        product_color.product_id,
    )

    db.commit()
    db.refresh(variant)

    return variant

# ============================================================
# GET VARIANT
# ============================================================

def get_product_variant(
    db: Session,
    variant_id: int,
) -> ProductVariant:

    variant = db.get(
        ProductVariant,
        variant_id,
    )

    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variant not found.",
        )

    return variant


# ============================================================
# GET VARIANTS
# ============================================================

def get_product_variants(
    db: Session,
    skip: int = 0,
    limit: int = 20,
):

    total = (
        db.query(ProductVariant)
        .count()
    )

    items = (
        db.query(ProductVariant)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": items,
    }


# ============================================================
# GET VARIANTS BY COLOR
# ============================================================

def get_variants_by_product_color(
    db: Session,
    product_color_id: int,
):

    return (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_color_id
            == product_color_id,
        )
        .all()
    )


# ============================================================
# UPDATE VARIANT
# ============================================================
def update_product_variant(
    db: Session,
    variant_id: int,
    data: ProductVariantUpdate,
) -> ProductVariant:

    variant = get_product_variant(
        db,
        variant_id,
    )

    values = data.model_dump(
        exclude_unset=True,
    )

    new_color_id = values.get(
        "product_color_id",
        variant.product_color_id,
    )

    new_size_id = values.get(
        "size_id",
        variant.size_id,
    )

    if "stock" in values and values["stock"] < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock cannot be negative.",
        )

    if (
        new_color_id != variant.product_color_id
        or new_size_id != variant.size_id
    ):

        duplicate = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.product_color_id
                == new_color_id,
                ProductVariant.size_id
                == new_size_id,
                ProductVariant.id != variant.id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "A variant already exists for "
                    "this color and size."
                ),
            )

    if "product_color_id" in values:
        product_color = db.get(
            ProductColor,
            values["product_color_id"],
        )

        if not product_color:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product color not found.",
            )

    if "size_id" in values:
        size = db.get(
            Size,
            values["size_id"],
        )

        if not size:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Size not found.",
            )

    for key, value in values.items():
        setattr(variant, key, value)

    db.flush()

    product_color = db.get(
        ProductColor,
        variant.product_color_id,
    )

    if product_color:
        sync_product_stock(
            db,
            product_color.product_id,
        )

    db.commit()
    db.refresh(variant)

    return variant

# ============================================================
# DELETE VARIANT
# ============================================================

def delete_product_variant(
    db: Session,
    variant_id: int,
) -> None:

    variant = get_product_variant(
        db,
        variant_id,
    )

    product_color = db.get(
        ProductColor,
        variant.product_color_id,
    )

    product_id = (
        product_color.product_id
        if product_color
        else None
    )

    db.delete(variant)

    db.flush()

    # Recalcul après suppression
    if product_id:
        sync_product_stock(
            db,
            product_id,
        )

    db.commit()