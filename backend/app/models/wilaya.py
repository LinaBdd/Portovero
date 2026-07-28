from sqlalchemy import (
    Numeric,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database.core import Base


class Wilaya(Base):
    __tablename__ = "wilayas"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    code: Mapped[int] = mapped_column(
        unique=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
    )

    home_delivery_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
    )

    office_delivery_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
    )