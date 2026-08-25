from decimal import Decimal

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Numeric,
    UniqueConstraint,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.core import Base


class ShippingRate(Base):
    __tablename__ = "shipping_rates"

    __table_args__ = (
        UniqueConstraint(
            "wilaya_id",
            "shipping_method_id",
            name="uq_shipping_rate_wilaya_method",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    wilaya_id: Mapped[int] = mapped_column(
        ForeignKey("wilayas.id", ondelete="CASCADE"),
        nullable=False,
    )

    shipping_method_id: Mapped[int] = mapped_column(
        ForeignKey(
            "shipping_methods.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    wilaya = relationship(
        "Wilaya",
        back_populates="shipping_rates",
    )

    shipping_method = relationship(
        "ShippingMethod",
        back_populates="shipping_rates",
    )