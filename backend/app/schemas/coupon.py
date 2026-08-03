from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
)


class CouponBase(BaseModel):
    name: str

    code: str

    description: str | None = None

    discount_type: Literal[
        "fixed",
        "percentage",
    ]

    discount_value: Decimal

    minimum_amount: Decimal | None = None

    maximum_discount: Decimal | None = None

    usage_limit: int | None = None

    usage_per_user: int = 1

    starts_at: datetime

    expires_at: datetime | None = None

    is_active: bool = True


class CouponCreate(CouponBase):
    pass


class CouponUpdate(BaseModel):
    name: str | None = None

    code: str | None = None

    description: str | None = None

    discount_type: Literal[
        "fixed",
        "percentage",
    ] | None = None

    discount_value: Decimal | None = None

    minimum_amount: Decimal | None = None

    maximum_discount: Decimal | None = None

    usage_limit: int | None = None

    usage_per_user: int | None = None

    starts_at: datetime | None = None

    expires_at: datetime | None = None

    is_active: bool | None = None


class CouponRead(CouponBase):
    id: int

    used_count: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )