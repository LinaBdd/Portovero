from datetime import datetime
from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
)


class CouponBase(BaseModel):
    code: str

    description: str | None = None

    discount_type: str

    discount_value: Decimal

    minimum_amount: Decimal | None = None

    usage_limit: int | None = None

    starts_at: datetime

    expires_at: datetime | None = None

    is_active: bool = True


class CouponCreate(CouponBase):
    pass


class CouponUpdate(BaseModel):
    code: str | None = None

    description: str | None = None

    discount_type: str | None = None

    discount_value: Decimal | None = None

    minimum_amount: Decimal | None = None

    usage_limit: int | None = None

    starts_at: datetime | None = None

    expires_at: datetime | None = None

    is_active: bool | None = None


class CouponRead(CouponBase):
    id: int

    used_count: int

    model_config = ConfigDict(
        from_attributes=True,
    )