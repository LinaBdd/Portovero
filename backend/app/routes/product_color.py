from fastapi import (
    APIRouter,
    Depends,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.product_color import (
    ProductColorCreate,
    ProductColorList,
    ProductColorRead,
    ProductColorUpdate,
)

from app.services.product_color import (
    create_product_color,
    delete_product_color,
    get_product_color,
    get_product_colors,
    update_product_color,
)

router = APIRouter(
    prefix="/product-colors",
    tags=["Product Colors"],
)


@router.post(
    "/create",
    response_model=ProductColorRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: ProductColorCreate,
    db: Session = Depends(get_db),
):
    return create_product_color(
        db,
        data,
    )


@router.get(
    "/{product_color_id}",
    response_model=ProductColorRead,
)
def retrieve(
    product_color_id: int,
    db: Session = Depends(get_db),
):
    return get_product_color(
        db,
        product_color_id,
    )


@router.get(
    "/product/{product_id}",
    response_model=ProductColorList,
)
def list_product_colors(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_product_colors(
        db,
        product_id,
    )


@router.put(
    "/{product_color_id}",
    response_model=ProductColorRead,
)
def update(
    product_color_id: int,
    data: ProductColorUpdate,
    db: Session = Depends(get_db),
):
    return update_product_color(
        db,
        product_color_id,
        data,
    )


@router.delete(
    "/{product_color_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    product_color_id: int,
    db: Session = Depends(get_db),
):
    delete_product_color(
        db,
        product_color_id,
    )