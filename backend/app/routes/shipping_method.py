from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.shipping_method import (
    ShippingMethodCreate,
    ShippingMethodRead,
    ShippingMethodUpdate,
)

from app.services.shipping_method import (
    create_shipping_method,
    delete_shipping_method,
    get_shipping_method,
    get_shipping_methods,
    update_shipping_method,
)

router = APIRouter(
    prefix="/shipping-methods",
    tags=["Shipping Methods"],
)


@router.get(
    "/",
    response_model=list[ShippingMethodRead],
)
def read_shipping_methods(
    db: Session = Depends(get_db),
):
    return get_shipping_methods(db)


@router.get(
    "/{shipping_method_id}",
    response_model=ShippingMethodRead,
)
def read_shipping_method(
    shipping_method_id: int,
    db: Session = Depends(get_db),
):
    shipping_method = get_shipping_method(
        db,
        shipping_method_id,
    )

    if not shipping_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping method not found.",
        )

    return shipping_method


@router.post(
    "/create",
    response_model=ShippingMethodRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    shipping_method: ShippingMethodCreate,
    db: Session = Depends(get_db),
):
    return create_shipping_method(
        db,
        shipping_method,
    )


@router.put(
    "/{shipping_method_id}",
    response_model=ShippingMethodRead,
)
def update(
    shipping_method_id: int,
    data: ShippingMethodUpdate,
    db: Session = Depends(get_db),
):
    shipping_method = update_shipping_method(
        db,
        shipping_method_id,
        data,
    )

    if not shipping_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping method not found.",
        )

    return shipping_method


@router.delete(
    "/{shipping_method_id}",
)
def delete(
    shipping_method_id: int,
    db: Session = Depends(get_db),
):
    shipping_method = delete_shipping_method(
        db,
        shipping_method_id,
    )

    if not shipping_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping method not found.",
        )

    return {
        "message": "Shipping method deleted successfully."
    }