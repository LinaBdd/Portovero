from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# PRODUCT BASE
# =========================================================

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    base_price: Decimal = Field(gt=0)
    compare_at_price: Decimal | None = Field(default=None, gt=0)
    stock: int = Field(ge=0)
    weight: Decimal | None = Field(default=None, ge=0)
    cost_price: Decimal | None = Field(default=None, ge=0)
    gender: str | None = None
    is_active: bool = True
    is_featured: bool = False
    is_new: bool = False


# =========================================================
# CREATE
# =========================================================

class ProductCreate(BaseModel):
    name: str
    slug: str | None = None
    description: str | None = None
    brand: str | None = None
    gender: str | None = None
    sku: str | None = None
    base_price: Decimal
    compare_at_price: Decimal | None = None
    weight: Decimal | None = None
    material_id: int | None = None
    is_new: bool = False
    is_featured: bool = False
    is_active: bool = True

# =========================================================
# UPDATE
# =========================================================

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    base_price: Decimal | None = Field(default=None, gt=0)
    compare_at_price: Decimal | None = Field(default=None, gt=0)
    cost_price: Decimal | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)
    weight: Decimal | None = Field(default=None, ge=0)
    gender: str | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    is_new: bool | None = None


# =========================================================
# SIZE
# =========================================================

class SizeRead(BaseModel):
    id: int
    name: str
    display_order: int
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# COLOR
# =========================================================

class ColorRead(BaseModel):
    id: int
    name: str
    hex_code: str
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# CATEGORY
# =========================================================

class CategoryRead(BaseModel):
    id: int
    name: str
    slug: str
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# PRODUCT IMAGE
# =========================================================

class ProductImageRead(BaseModel):
    id: int
    product_color_id: int
    image_url: str
    alt: str | None = None
    position: int | None = None
    is_primary: bool = False
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# PRODUCT VARIANT
# =========================================================

class ProductVariantRead(BaseModel):
    id: int
    product_color_id: int
    size_id: int
    sku: str | None = None
    stock: int
    price: Decimal | None = None
    size: SizeRead | None = None
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# PRODUCT COLOR
# =========================================================

class ProductColorRead(BaseModel):
    id: int
    product_id: int
    color_id: int
    color: ColorRead | None = None
    images: list[ProductImageRead] = Field(default_factory=list)
    variants: list[ProductVariantRead] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# PRODUCT CATEGORY
# =========================================================

class ProductCategoryRead(BaseModel):
    category: CategoryRead
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# PRODUCT READ
# =========================================================

class ProductRead(ProductBase):
    id: int
    slug: str
    sku: str 
    created_at: datetime
    updated_at: datetime
    colors: list[ProductColorRead] = Field(default_factory=list)
    categories: list[ProductCategoryRead] = Field(default_factory=list)
    profit: Decimal | None = Field(default=None, gt=0)
    model_config = ConfigDict(from_attributes=True)


# =========================================================
# PAGINATION
# =========================================================

class ProductList(BaseModel):
    total: int
    items: list[ProductRead]