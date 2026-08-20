from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.admin import AdminProductCreate, DashboardStats
from app.schemas.user import UserRead
from app.schemas.order import OrderRead
from app.schemas.payment import PaymentRead

from app.services.admin import (
    create_product_admin,
    dashboard,
    get_users,
    get_orders,
    get_payments,
    update_order_payment_status,
)
from app.models.user import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


class PaymentStatusUpdate(BaseModel):
    payment_status: str

@router.get(
    "/dashboard",
    response_model=DashboardStats,
)
def read_dashboard(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return dashboard(db)


@router.get(
    "/users",
    response_model=list[UserRead],
)
def users(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return get_users(db)


@router.get(
    "/orders",
    response_model=list[OrderRead],
)
def orders(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return get_orders(db)


@router.get(
    "/payments",
    response_model=list[PaymentRead],
)
def payments(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return get_payments(db)



@router.patch(
    "/orders/{order_id}/payment-status"
)
def change_payment_status(
    order_id: int,
    data: PaymentStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):

    order = update_order_payment_status(
        db,
        order_id,
        data.payment_status,
    )

    if not order:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Commande introuvable",
        )

    return {
        "message": "Statut paiement modifié",
        "payment_status": order.payment_status,
    }



@router.post(
    "/products/create",
)
def create_product_admin_route(
    data: AdminProductCreate,
    db: Session = Depends(get_db),
):

    return create_product_admin(
        db,
        data,
    )