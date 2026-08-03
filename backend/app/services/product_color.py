from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.color import Color
from app.models.product import Product
from app.models.product_color import ProductColor

from app.schemas.product_color import (
    ProductColorCreate,
    ProductColorUpdate,
)


def create_product_color(
    db: Session,
    data: ProductColorCreate,
) -> ProductColor:

    product = db.get(
        Product,
        data.product_id,
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    color = db.get(
        Color,
        data.color_id,
    )

    if not color:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Color not found.",
        )

    existing = (
        db.query(ProductColor)
        .filter(
            ProductColor.product_id == data.product_id,
            ProductColor.color_id == data.color_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Color already assigned to this product.",
        )

    product_color = ProductColor(
        **data.model_dump(),
    )

    db.add(product_color)
    db.commit()
    db.refresh(product_color)

    return product_color


def get_product_color(
    db: Session,
    product_color_id: int,
) -> ProductColor:

    product_color = db.get(
        ProductColor,
        product_color_id,
    )

    if not product_color:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product color not found.",
        )

    return product_color


def get_product_colors(
    db: Session,
    product_id: int,
):

    total = (
        db.query(ProductColor)
        .filter(
            ProductColor.product_id == product_id,
        )
        .count()
    )

    items = (
        db.query(ProductColor)
        .filter(
            ProductColor.product_id == product_id,
        )
        .all()
    )

    return {
        "total": total,
        "items": items,
    }


def update_product_color(
    db: Session,
    product_color_id: int,
    data: ProductColorUpdate,
) -> ProductColor:

    product_color = get_product_color(
        db,
        product_color_id,
    )

    values = data.model_dump(
        exclude_unset=True,
    )

    if "color_id" in values:

        color = db.get(
            Color,
            values["color_id"],
        )

        if not color:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Color not found.",
            )

        existing = (
            db.query(ProductColor)
            .filter(
                ProductColor.product_id == product_color.product_id,
                ProductColor.color_id == values["color_id"],
                ProductColor.id != product_color.id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Color already assigned to this product.",
            )

    for key, value in values.items():
        setattr(
            product_color,
            key,
            value,
        )

    db.commit()
    db.refresh(product_color)

    return product_color


def delete_product_color(
    db: Session,
    product_color_id: int,
) -> None:

    product_color = get_product_color(
        db,
        product_color_id,
    )

    db.delete(product_color)
    db.commit()