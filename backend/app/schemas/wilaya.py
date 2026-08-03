from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class WilayaBase(BaseModel):
    code: int = Field(ge=1, le=69)

    name: str

    home_shipping_price: Decimal = Field(ge=0)

    stopdesk_shipping_price: Decimal = Field(ge=0)

    is_active: bool = True


class WilayaCreate(WilayaBase):
    pass


class WilayaUpdate(BaseModel):
    code: int | None = Field(default=None, ge=1, le=69)

    name: str | None = None

    home_shipping_price: Decimal | None = Field(
        default=None,
        ge=0,
    )

    stopdesk_shipping_price: Decimal | None = Field(
        default=None,
        ge=0,
    )

    is_active: bool | None = None


class WilayaRead(WilayaBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


class WilayaList(BaseModel):
    total: int

    items: list[WilayaRead]