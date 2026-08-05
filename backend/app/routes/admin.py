from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.admin import DashboardStats

from app.schemas.user import UserRead
from app.schemas.order import OrderRead
from app.schemas.payment import PaymentRead

from app.services.admin import (
    dashboard,
    get_users,
    get_orders,
    get_payments,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)
@router.get(
    "/dashboard",
    response_model=DashboardStats,
)
def read_dashboard(
    db: Session = Depends(get_db),
):
    return dashboard(db)


@router.get(
    "/users",
    response_model=list[UserRead],
)
def users(
    db: Session = Depends(get_db),
):
    return get_users(db)


@router.get(
    "/orders",
    response_model=list[OrderRead],
)
def orders(
    db: Session = Depends(get_db),
):
    return get_orders(db)



@router.get(
    "/payments",
    response_model=list[PaymentRead],
)
def payments(
    db: Session = Depends(get_db),
):
    return get_payments(db)
