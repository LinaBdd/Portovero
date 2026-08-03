from sqlalchemy.orm import Session

from app.models.shipping_method import ShippingMethod
from app.schemas.shipping_method import (
    ShippingMethodCreate,
    ShippingMethodUpdate,
)


def get_shipping_methods(db: Session):
    return (
        db.query(ShippingMethod)
        .order_by(ShippingMethod.id)
        .all()
    )


def get_shipping_method(
    db: Session,
    shipping_method_id: int,
):
    return (
        db.query(ShippingMethod)
        .filter(
            ShippingMethod.id == shipping_method_id
        )
        .first()
    )


def create_shipping_method(
    db: Session,
    shipping_method: ShippingMethodCreate,
):
    db_shipping_method = ShippingMethod(
        **shipping_method.model_dump()
    )

    db.add(db_shipping_method)
    db.commit()
    db.refresh(db_shipping_method)

    return db_shipping_method


def update_shipping_method(
    db: Session,
    shipping_method_id: int,
    data: ShippingMethodUpdate,
):
    db_shipping_method = get_shipping_method(
        db,
        shipping_method_id,
    )

    if not db_shipping_method:
        return None

    for key, value in data.model_dump(
        exclude_unset=True,
    ).items():
        setattr(
            db_shipping_method,
            key,
            value,
        )

    db.commit()
    db.refresh(db_shipping_method)

    return db_shipping_method


def delete_shipping_method(
    db: Session,
    shipping_method_id: int,
):
    db_shipping_method = get_shipping_method(
        db,
        shipping_method_id,
    )

    if not db_shipping_method:
        return None

    db.delete(db_shipping_method)
    db.commit()

    return db_shipping_method