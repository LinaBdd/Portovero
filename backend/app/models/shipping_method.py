from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Integer,
    Numeric,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database.core import Base


class ShippingMethod(Base):
    __tablename__ = "shipping_methods"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
    )

    estimated_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    base_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )