from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
)


class ShippingMethodBase(BaseModel):
    name: str

    description: str | None = None

    estimated_days: int

    base_price: Decimal

    is_active: bool = True


class ShippingMethodCreate(ShippingMethodBase):
    pass


class ShippingMethodUpdate(BaseModel):
    name: str | None = None

    description: str | None = None

    estimated_days: int | None = None

    base_price: Decimal | None = None

    is_active: bool | None = None


class ShippingMethodRead(ShippingMethodBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )