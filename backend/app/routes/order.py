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
    GuestOrderCreate,
)

from app.services.order import (
    cancel_order,
    create_order,
    create_guest_order,
    get_order,
    get_orders,
    get_orders_by_user,
    update_order,
)

from app.auth.dependencies import (
    get_current_user,
    get_current_admin,
)

from app.models.user import User


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


# ============================================================
# MY ORDERS
# ============================================================

@router.get(
    "/my-orders",
    response_model=list[OrderRead],
)
def read_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_orders_by_user(
        db=db,
        user_id=current_user.id,
    )


# ============================================================
# ALL ORDERS
# ADMIN ONLY
# ============================================================

@router.get(
    "/",
    response_model=list[OrderRead],
)
def read_orders(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return get_orders(db)


# ============================================================
# GUEST CHECKOUT
#
# IMPORTANT :
# Cette route doit être placée avant /{order_id}
# ============================================================

@router.post(
    "/guest",
    response_model=OrderRead,
    status_code=status.HTTP_201_CREATED,
)
def create_guest(
    data: GuestOrderCreate,
    db: Session = Depends(get_db),
):
    order = create_guest_order(
        db=db,
        data=data,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create order.",
        )

    return order


# ============================================================
# CREATE ORDER
# AUTHENTICATED USER
# ============================================================

@router.post(
    "/create",
    response_model=OrderRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_order(
        db=db,
        data=order,
    )


# ============================================================
# GET ONE ORDER
# ADMIN ONLY
# ============================================================

@router.get(
    "/{order_id}",
    response_model=OrderRead,
)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    order = get_order(
        db=db,
        order_id=order_id,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    return order


# ============================================================
# UPDATE ORDER
# ADMIN ONLY
# ============================================================

@router.put(
    "/{order_id}",
    response_model=OrderRead,
)
def update(
    order_id: int,
    data: OrderUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    order = update_order(
        db=db,
        order_id=order_id,
        data=data,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    return order


# ============================================================
# CANCEL ORDER
# ADMIN ONLY
# ============================================================

@router.put(
    "/{order_id}/cancel",
    response_model=OrderRead,
)
def cancel(
    order_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    order = cancel_order(
        db=db,
        order_id=order_id,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    return order