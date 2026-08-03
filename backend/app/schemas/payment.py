from datetime import datetime
from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
)


class PaymentBase(BaseModel):
    method: str
    amount: Decimal
    status: str = "pending"


class PaymentCreate(PaymentBase):
    order_id: int


class PaymentUpdate(BaseModel):
    status: str | None = None
    transaction_id: str | None = None


class PaymentRead(PaymentBase):
    id: int

    order_id: int

    transaction_id: str | None = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )