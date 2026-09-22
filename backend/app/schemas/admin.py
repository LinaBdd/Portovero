from decimal import Decimal
from pydantic import BaseModel, Field


class AdminProductImageCreate(BaseModel):
    url: str
    alt: str | None = None
    position: int = 0
    is_primary: bool = False


class AdminProductColorCreate(BaseModel):
    color_id: int
    images: list[AdminProductImageCreate] = Field(default_factory=list)


class AdminProductVariantCreate(BaseModel):
    color_id: int
    size_id: int
    sku: str | None = None
    stock: int = Field(default=0, ge=0)
    price: Decimal = Field(gt=0)
    old_price: Decimal | None = Field(default=None, gt=0)
    is_active: bool = True


class AdminProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    description: str | None = None

    base_price: Decimal = Field(gt=0)
    compare_at_price: Decimal | None = Field(default=None, gt=0)
    cost_price: Decimal | None = Field(default=None, ge=0)

    stock: int = Field(default=0, ge=0)

    weight: Decimal | None = Field(default=None, ge=0)
    gender: str | None = None

    is_active: bool = True
    is_featured: bool = False
    is_new: bool = False

    category_id: int | None = None

    colors: list[AdminProductColorCreate] = Field(
        default_factory=list
    )

    variants: list[AdminProductVariantCreate] = Field(
        default_factory=list
    )
# ============================================================
# SCHÉMAS POUR LA MISE À JOUR
# ============================================================

class AdminProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    base_price: Decimal | None = None
    compare_at_price: Decimal | None = None
    cost_price: Decimal | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)
    weight: Decimal | None = None
    gender: str | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    is_new: bool | None = None
    category_ids: list[int] | None = None
    # Le formulaire admin envoie une seule catégorie et les variantes « à plat »
    # (comme à la création) : on accepte les deux formats.
    category_id: int | None = None
    colors: list["ColorUpdate"] | None = None
    variants: list["VariantUpdate"] | None = None


class ImageUpdate(BaseModel):
    id: int | None = None
    url: str
    alt: str | None = None
    position: int = 0
    is_primary: bool = False


class VariantUpdate(BaseModel):
    id: int | None = None
    color_id: int
    size_id: int
    stock: int = Field(ge=0)
    price: Decimal = Field(gt=0)
    old_price: Decimal | None = Field(default=None, gt=0)
    is_active: bool = True


class ColorUpdate(BaseModel):
    id: int | None = None
    color_id: int
    is_primary: bool = False
    images: list[ImageUpdate] | None = None
    variants: list[VariantUpdate] | None = None


# ============================================================
# SCHÉMAS POUR LE DASHBOARD
# ============================================================

class MonthlyStats(BaseModel):
    month: str
    revenue: float
    orders: int


class StatusStats(BaseModel):
    status: str
    count: int


class PaymentStats(BaseModel):
    status: str
    count: int


class StockAlertProduct(BaseModel):
    id: int
    name: str
    sku: str
    stock: int


class DashboardStats(BaseModel):
    total_users: int

    total_products: int
    active_products: int
    inactive_products: int

    total_orders: int
    confirmed_orders: int
    pending_orders: int

    paid_orders: int

    total_payments: int
    paid_payments: int

    revenue: float

    total_stock: int

    total_stock_value_cost: float
    total_stock_value_sale: float
    total_potential_profit: float

    out_of_stock_count: int
    low_stock_count: int
    low_stock_threshold: int

    monthly_stats: list[MonthlyStats]

    order_statuses: list[StatusStats]

    payment_statuses: list[PaymentStats]

    out_of_stock_products: list[StockAlertProduct]

    low_stock_products: list[StockAlertProduct]

    
# Pour éviter les problèmes de forward references
AdminProductUpdate.model_rebuild()
ColorUpdate.model_rebuild()