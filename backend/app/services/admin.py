from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.payment import Payment


def dashboard(db: Session):
    total_users = db.query(User).count()

    total_products = db.query(Product).count()

    total_orders = db.query(Order).count()

    total_payments = db.query(Payment).count()

    pending_orders = (
        db.query(Order)
        .filter(Order.status == "pending")
        .count()
    )

    revenue = (
        db.query(func.sum(Order.total))
        .filter(Order.payment_status == "paid")
        .scalar()
        or 0
    )

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_payments": total_payments,
        "pending_orders": pending_orders,
        "revenue": float(revenue),
    }


def get_users(db: Session):
    return (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )


def get_orders(db: Session):
    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )



def get_payments(db: Session):
    return (
        db.query(Payment)
        .order_by(Payment.created_at.desc())
        .all()
    )