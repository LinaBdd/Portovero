from decimal import Decimal
from pydantic import BaseModel, Field


class AdminProductImageCreate(BaseModel):
    url: str
    alt: str | None = None
    position: int = 0
    is_primary: bool = False


class AdminProductColorCreate(BaseModel):
    color_id: int
    images: list[AdminProductImageCreate] = []


class AdminProductVariantCreate(BaseModel):
    color_id: int
    size_id: int

    stock: int = Field(ge=0)

    price: Decimal = Field(gt=0)
    old_price: Decimal | None = Field(default=None, gt=0)

    is_active: bool = True


class AdminProductCreate(BaseModel):

    name: str
    description: str | None = None

    base_price: Decimal
    compare_at_price: Decimal | None = None

    stock: int = Field(ge=0)
    weight: Decimal | None = None

    gender: str | None = None

    is_active: bool = True
    is_featured: bool = False
    is_new: bool = False

    category_id: int | None = None

    colors: list[AdminProductColorCreate] = []

    variants: list[AdminProductVariantCreate] = []



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


class DashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_payments: int
    pending_orders: int
    revenue: float

    monthly_stats: list[MonthlyStats]
    order_statuses: list[StatusStats]
    payment_statuses: list[PaymentStats]