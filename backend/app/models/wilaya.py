from sqlalchemy import (
    Boolean,
    Integer,
    Numeric,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.core import Base

class Wilaya(Base):
    __tablename__ = "wilayas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    code: Mapped[int] = mapped_column(
        unique=True,
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    name_ar: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    home_shipping_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    stopdesk_shipping_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    communes = relationship(
        "Commune",
        back_populates="wilaya",
        cascade="all, delete-orphan",
    )

    addresses = relationship(
        "Address",
        back_populates="wilaya",
    )