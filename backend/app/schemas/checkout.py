from pydantic import BaseModel
from decimal import Decimal

from pydantic import BaseModel


class CheckoutResponse(BaseModel):
    order_id: int

    payment_id: int

    subtotal: Decimal

    shipping_cost: Decimal

    discount: Decimal

    total: Decimal

    message: str

    

class CheckoutRequest(BaseModel):
    user_id: int

    address_id: int

    shipping_method_id: int

    payment_method: str

    coupon_code: str | None = None

    notes: str | None = None