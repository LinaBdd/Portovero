from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
)


def get_payments(db: Session):
    return db.query(Payment).all()


def get_payment(
    db: Session,
    payment_id: int,
):
    return (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )


def get_payment_by_order(
    db: Session,
    order_id: int,
):
    return (
        db.query(Payment)
        .filter(Payment.order_id == order_id)
        .first()
    )


def create_payment(
    db: Session,
    payment: PaymentCreate,
):
    db_payment = Payment(
        **payment.model_dump()
    )

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    return db_payment


def update_payment(
    db: Session,
    payment_id: int,
    data: PaymentUpdate,
):
    db_payment = get_payment(
        db,
        payment_id,
    )

    if not db_payment:
        return None

    for key, value in data.model_dump(
        exclude_unset=True,
    ).items():
        setattr(
            db_payment,
            key,
            value,
        )

    db.commit()
    db.refresh(db_payment)

    return db_payment


def delete_payment(
    db: Session,
    payment_id: int,
):
    db_payment = get_payment(
        db,
        payment_id,
    )

    if not db_payment:
        return None

    db.delete(db_payment)
    db.commit()

    return db_payment