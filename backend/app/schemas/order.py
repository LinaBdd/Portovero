from datetime import datetime
from decimal import Decimal



from pydantic import BaseModel, ConfigDict


# ============================================================
# ORDER BASE
# ============================================================

class OrderBase(BaseModel):
    first_name: str
    last_name: str
    phone: str

    email: str | None = None

    address: str
    wilaya: str
    commune: str

    shipping_method: str

    subtotal: Decimal
    shipping_cost: Decimal
    discount: Decimal
    total: Decimal

    status: str

    payment_method: str
    payment_status: str

    coupon_code: str | None = None
    notes: str | None = None


# ============================================================
# ORDER ITEM
# ============================================================

class OrderItemRead(BaseModel):

    id: int

    product_variant_id: int | None = None

    product_name: str

    color: str | None = None

    size: str | None = None

    product_image: str | None = None

    quantity: int

    unit_price: Decimal

    total_price: Decimal


    model_config = ConfigDict(
        from_attributes=True,
    )

# ============================================================
# AUTHENTICATED ORDER
# ============================================================

class OrderCreate(BaseModel):
    address_id: int
    shipping_method_id: int

    payment_method: str

    coupon_code: str | None = None
    notes: str | None = None


# ============================================================
# UPDATE
# ============================================================

class OrderUpdate(BaseModel):
    status: str | None = None

    payment_status: str | None = None

    payment_method: str | None = None

    notes: str | None = None


# ============================================================
# READ
# ============================================================

class OrderRead(OrderBase):
    id: int

    user_id: int | None = None

    created_at: datetime
    updated_at: datetime

    items: list[OrderItemRead] = []

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# LIST
# ============================================================

class OrderList(BaseModel):
    total: int
    items: list[OrderRead]


# ============================================================
# GUEST ORDER ITEM
# ============================================================

class GuestOrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    product_variant_id: int | None = None


# ============================================================
# GUEST ORDER
# ============================================================

class GuestOrderCreate(BaseModel):
    first_name: str
    last_name: str

    phone: str

    address: str

    wilaya_id: int
    commune_id: int

    shipping_method_id: int

    payment_method: str

    items: list[GuestOrderItemCreate]

    coupon_code: str | None = None

    notes: str | None = None




class OrderItemResponse(BaseModel):

    id: int

    product_variant_id: int | None

    product_name: str

    color: str | None

    size: str | None

    product_image: str | None

    quantity: int

    unit_price: Decimal

    total_price: Decimal


    class Config:
        from_attributes = True    


class OrderResponse(BaseModel):

    id: int

    user_id: int | None

    first_name: str
    last_name: str

    phone: str

    address: str

    wilaya: str
    commune: str

    shipping_method: str

    subtotal: Decimal

    shipping_cost: Decimal

    discount: Decimal

    total: Decimal

    status: str

    payment_method: str

    payment_status: str

    items: list[OrderItemResponse]


    class Config:
        from_attributes = True        