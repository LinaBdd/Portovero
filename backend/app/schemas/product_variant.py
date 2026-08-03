from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ProductVariantBase(BaseModel):
    product_color_id: int
    size_id: int

    stock: int = Field(ge=0)

    price: Decimal = Field(gt=0)
    old_price: Decimal | None = Field(
        default=None,
        gt=0,
    )

    is_active: bool = True

class ProductVariantCreate(ProductVariantBase):
    pass


class ProductVariantUpdate(BaseModel):
    product_color_id: int | None = None
    size_id: int | None = None

    sku: str | None = None

    stock: int | None = Field(default=None, ge=0)

    price: Decimal | None = Field(default=None, gt=0)
    old_price: Decimal | None = Field(default=None, gt=0)

    is_active: bool | None = None


class ProductVariantRead(ProductVariantBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


class ProductVariantList(BaseModel):
    total: int
    items: list[ProductVariantRead]