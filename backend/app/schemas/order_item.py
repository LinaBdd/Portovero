from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
)


class OrderItemBase(BaseModel):
    product_variant_id: int | None = None

    product_name: str

    color: str

    size: str

    product_image: str | None = None

    quantity: int

    unit_price: Decimal

    total_price: Decimal


class OrderItemCreate(OrderItemBase):
    order_id: int


class OrderItemUpdate(BaseModel):
    quantity: int | None = None

    unit_price: Decimal | None = None

    total_price: Decimal | None = None


class OrderItemRead(OrderItemBase):
    id: int

    order_id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


class OrderItemList(BaseModel):
    total: int

    items: list[OrderItemRead]