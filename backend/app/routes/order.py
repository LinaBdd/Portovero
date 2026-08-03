from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.order import (
    OrderCreate,
    OrderRead,
    OrderUpdate,
)

from app.services.order import (
    cancel_order,
    create_order,
    get_order,
    get_orders,
    get_orders_by_user,
    update_order,
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)

@router.get(
    "/",
    response_model=list[OrderRead],
)
def read_orders(
    db: Session = Depends(get_db),
):
    return get_orders(db)


@router.get(
    "/{order_id}",
    response_model=OrderRead,
)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = get_order(
        db,
        order_id,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    return order



@router.post(
    "/create",
    response_model=OrderRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    order: OrderCreate,
    db: Session = Depends(get_db),
):
    return create_order(
        db,
        order,
   )

@router.put(
    "/{order_id}",
    response_model=OrderRead,
)
def update(
    order_id: int,
    data: OrderUpdate,
    db: Session = Depends(get_db),
):
    order = update_order(
        db,
        order_id,
        data,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    return order



@router.put(
    "/{order_id}/cancel",
    response_model=OrderRead,
)
def cancel(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = cancel_order(
        db,
        order_id,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    return order



