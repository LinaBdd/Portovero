from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantRead,
    ProductVariantUpdate,
    ProductVariantList,
)

from app.services.product_variant import (
    create_product_variant,
    get_product_variant,
    get_product_variants,
    get_variants_by_product_color,
    update_product_variant,
    delete_product_variant,
)

router = APIRouter(
    prefix="/product-variants",
    tags=["Product Variants"],
)


@router.post(
    "/",
    response_model=ProductVariantRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: ProductVariantCreate,
    db: Session = Depends(get_db),
):
    return create_product_variant(
        db,
        data,
    )


@router.get(
    "/",
    response_model=ProductVariantList,
)
def list_all(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    return get_product_variants(
        db,
        skip,
        limit,
    )


@router.get(
    "/{variant_id}",
    response_model=ProductVariantRead,
)
def get(
    variant_id: int,
    db: Session = Depends(get_db),
):
    return get_product_variant(
        db,
        variant_id,
    )


@router.get(
    "/product-color/{product_color_id}",
    response_model=list[ProductVariantRead],
)
def by_product_color(
    product_color_id: int,
    db: Session = Depends(get_db),
):
    return get_variants_by_product_color(
        db,
        product_color_id,
    )


@router.put(
    "/{variant_id}",
    response_model=ProductVariantRead,
)
def update(
    variant_id: int,
    data: ProductVariantUpdate,
    db: Session = Depends(get_db),
):
    return update_product_variant(
        db,
        variant_id,
        data,
    )


@router.delete(
    "/{variant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    variant_id: int,
    db: Session = Depends(get_db),
):
    delete_product_variant(
        db,
        variant_id,
    )