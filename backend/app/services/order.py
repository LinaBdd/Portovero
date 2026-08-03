from decimal import Decimal

from sqlalchemy.orm import Session
from app.models.address import Address
from app.models.shipping_method import ShippingMethod
from app.models.order import Order
from app.schemas.order import (
    OrderCreate,
    OrderUpdate,
)
from app.schemas import order, shipping_method, user


def get_orders(db: Session):
    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order(
    db: Session,
    order_id: int,
):
    return (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )


def get_orders_by_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def create_order(
    db: Session,
    data: OrderCreate,
):
    address = (
        db.query(Address)
        .filter(Address.id == data.address_id)
        .first()
    )

    if not address:
        return None

    shipping = (
        db.query(ShippingMethod)
        .filter(
            ShippingMethod.id == data.shipping_method_id
        )
        .first()
    )

    if not shipping:
        return None

    user = address.user

    db_order = Order(
        user_id=address.user_id,

        first_name=address.first_name,
        last_name=address.last_name,
        phone=address.phone,
        email=user.email if user else None,

        address=address.address,
        wilaya=address.wilaya.name,
        commune=address.commune.name,

        shipping_method=shipping.name,

        subtotal=Decimal("0"),
        shipping_cost=shipping.base_price,
        discount=Decimal("0"),
        total=shipping.base_price,

        status="pending",

        payment_method=data.payment_method,
        payment_status="pending",

        coupon_code=data.coupon_code,
        notes=data.notes,
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return db_order


def update_order(
    db: Session,
    order_id: int,
    data: OrderUpdate,
):
    db_order = get_order(
        db,
        order_id,
    )

    if not db_order:
        return None

    for key, value in data.model_dump(
        exclude_unset=True
    ).items():
        setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)

    return db_order


def cancel_order(
    db: Session,
    order_id: int,
):
    db_order = get_order(
        db,
        order_id,
    )

    if not db_order:
        return None

    db_order.status = "cancelled"

    db.commit()
    db.refresh(db_order)

    return db_order