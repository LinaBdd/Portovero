from pydantic import (
    BaseModel,
    ConfigDict,
)


class CartItemBase(BaseModel):
    product_variant_id: int
    quantity: int = 1


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemRead(CartItemBase):
    id: int
    user_id: int

    model_config = ConfigDict(
        from_attributes=True,
    )