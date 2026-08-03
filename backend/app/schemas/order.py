from datetime import datetime
from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
)


class OrderBase(BaseModel):
    first_name: str

    last_name: str

    phone: str

    email: str | None = None

    address: str

    wilaya: str

    commune: str

    shipping_method: str

    subtotal: Decimal

    shipping_cost: Decimal

    discount: Decimal

    total: Decimal

    status: str

    payment_method: str

    payment_status: str

    coupon_code: str | None = None

    notes: str | None = None


class OrderCreate(BaseModel):
    address_id: int

    shipping_method_id: int

    payment_method: str

    coupon_code: str | None = None

    notes: str | None = None


class OrderUpdate(BaseModel):
    status: str | None = None

    payment_status: str | None = None

    payment_method: str | None = None

    notes: str | None = None


class OrderRead(OrderBase):
    id: int

    user_id: int | None = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class OrderList(BaseModel):
    total: int

    items: list[OrderRead]