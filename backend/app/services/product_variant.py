from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.product_variant import ProductVariant
from app.models.product_color import ProductColor
from app.models.size import Size

from app.schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantUpdate,
)


def generate_variant_sku(db: Session) -> str:
    last = (
        db.query(ProductVariant)
        .order_by(ProductVariant.id.desc())
        .first()
    )

    if not last:
        return "VAR-000001"

    return f"VAR-{last.id + 1:06d}"


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
    db.commit()
    db.refresh(variant)

    return variant


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


def get_product_variants(
    db: Session,
    skip: int = 0,
    limit: int = 20,
):

    total = db.query(ProductVariant).count()

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


def get_variants_by_product_color(
    db: Session,
    product_color_id: int,
):

    return (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_color_id == product_color_id,
        )
        .all()
    )


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
        setattr(
            variant,
            key,
            value,
        )

    db.commit()
    db.refresh(variant)

    return variant


def delete_product_variant(
    db: Session,
    variant_id: int,
) -> None:

    variant = get_product_variant(
        db,
        variant_id,
    )

    db.delete(variant)
    db.commit()