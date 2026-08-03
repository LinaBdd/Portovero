from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.product_image import (
    ProductImageCreate,
    ProductImageRead,
    ProductImageUpdate,
)
from app.services.product_image import (
    create_product_image,
    delete_product_image,
    get_product_image,
    get_product_images,
    update_product_image,
)

router = APIRouter(
    prefix="/product-images",
    tags=["Product Images"],
)


@router.post(
    "/",
    response_model=ProductImageRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: ProductImageCreate,
    db: Session = Depends(get_db),
):
    return create_product_image(
        db,
        data,
    )


@router.get(
    "/{image_id}",
    response_model=ProductImageRead,
)
def get(
    image_id: int,
    db: Session = Depends(get_db),
):
    return get_product_image(
        db,
        image_id,
    )


@router.get(
    "/color/{product_color_id}",
    response_model=list[ProductImageRead],
)
def list_images(
    product_color_id: int,
    db: Session = Depends(get_db),
):
    return get_product_images(
        db,
        product_color_id,
    )


@router.put(
    "/{image_id}",
    response_model=ProductImageRead,
)
def update(
    image_id: int,
    data: ProductImageUpdate,
    db: Session = Depends(get_db),
):
    return update_product_image(
        db,
        image_id,
        data,
    )


@router.delete(
    "/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    image_id: int,
    db: Session = Depends(get_db),
):
    delete_product_image(
        db,
        image_id,
    )