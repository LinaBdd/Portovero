from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_users: int

    total_products: int

    total_orders: int

    total_payments: int

    pending_orders: int

    revenue: float