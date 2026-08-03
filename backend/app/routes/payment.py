from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.payment import (
    PaymentCreate,
    PaymentRead,
    PaymentUpdate,
)

from app.services.payment import (
    create_payment,
    delete_payment,
    get_payment,
    get_payment_by_order,
    get_payments,
    update_payment,
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.get(
    "/",
    response_model=list[PaymentRead],
)
def read_payments(
    db: Session = Depends(get_db),
):
    return get_payments(db)


@router.get(
    "/{payment_id}",
    response_model=PaymentRead,
)
def read_payment(
    payment_id: int,
    db: Session = Depends(get_db),
):
    payment = get_payment(
        db,
        payment_id,
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return payment


@router.get(
    "/order/{order_id}",
    response_model=PaymentRead,
)
def read_payment_by_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    payment = get_payment_by_order(
        db,
        order_id,
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return payment


@router.post(
    "/create",
    response_model=PaymentRead,
)
def create(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
):
    return create_payment(
        db,
        payment,
    )


@router.put(
    "/{payment_id}",
    response_model=PaymentRead,
)
def update(
    payment_id: int,
    payment: PaymentUpdate,
    db: Session = Depends(get_db),
):
    db_payment = update_payment(
        db,
        payment_id,
        payment,
    )

    if not db_payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return db_payment


@router.delete(
    "/{payment_id}",
)
def delete(
    payment_id: int,
    db: Session = Depends(get_db),
):
    db_payment = delete_payment(
        db,
        payment_id,
    )

    if not db_payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return {
        "message": "Payment deleted successfully",
    }