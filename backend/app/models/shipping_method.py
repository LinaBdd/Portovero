from sqlalchemy import String

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
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
    )