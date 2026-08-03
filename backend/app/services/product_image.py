from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.product_color import ProductColor
from app.models.product_image import ProductImage
from app.schemas.product_image import (
    ProductImageCreate,
    ProductImageUpdate,
)


def create_product_image(
    db: Session,
    data: ProductImageCreate,
) -> ProductImage:

    product_color = db.get(
        ProductColor,
        data.product_color_id,
    )

    if not product_color:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product color not found.",
        )

    if data.is_primary:
        (
            db.query(ProductImage)
            .filter(
                ProductImage.product_color_id == data.product_color_id
            )
            .update(
                {
                    ProductImage.is_primary: False,
                }
            )
        )

    image = ProductImage(
        **data.model_dump(),
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    return image


def get_product_image(
    db: Session,
    image_id: int,
) -> ProductImage:

    image = db.get(
        ProductImage,
        image_id,
    )

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found.",
        )

    return image


def get_product_images(
    db: Session,
    product_color_id: int,
) -> list[ProductImage]:

    return (
        db.query(ProductImage)
        .filter(
            ProductImage.product_color_id == product_color_id
        )
        .order_by(
            ProductImage.position
        )
        .all()
    )


def update_product_image(
    db: Session,
    image_id: int,
    data: ProductImageUpdate,
) -> ProductImage:

    image = get_product_image(
        db,
        image_id,
    )

    values = data.model_dump(
        exclude_unset=True,
    )

    if values.get("is_primary"):

        (
            db.query(ProductImage)
            .filter(
                ProductImage.product_color_id == image.product_color_id
            )
            .update(
                {
                    ProductImage.is_primary: False,
                }
            )
        )

    for key, value in values.items():
        setattr(
            image,
            key,
            value,
        )

    db.commit()
    db.refresh(image)

    return image


def delete_product_image(
    db: Session,
    image_id: int,
) -> None:

    image = get_product_image(
        db,
        image_id,
    )

    db.delete(image)
    db.commit()