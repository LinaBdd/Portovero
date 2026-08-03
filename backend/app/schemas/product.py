from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str
    description: str | None = None

    base_price: Decimal = Field(gt=0)

    compare_at_price: Decimal | None = Field(
        default=None,
        gt=0,
    )

    stock: int = Field(
        ge=0,
    )

    weight: Decimal | None = Field(
        default=None,
        ge=0,
    )

    is_active: bool = True
    is_featured: bool = False
    is_new: bool = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

    base_price: Decimal | None = Field(
        default=None,
        gt=0,
    )

    compare_at_price: Decimal | None = Field(
        default=None,
        gt=0,
    )

    stock: int | None = Field(
        default=None,
        ge=0,
    )

    weight: Decimal | None = Field(
        default=None,
        ge=0,
    )

    is_active: bool | None = None
    is_featured: bool | None = None
    is_new: bool | None = None


class ProductRead(ProductBase):
    id: int

    slug: str
    sku: str

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ProductList(BaseModel):
    total: int
    items: list[ProductRead]