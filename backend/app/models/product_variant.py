from sqlalchemy import (
    Boolean,
    ForeignKey,
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


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    product_color_id: Mapped[int] = mapped_column(
        ForeignKey(
            "product_colors.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    size_id: Mapped[int] = mapped_column(
        ForeignKey("sizes.id"),
        nullable=False,
    )

    sku: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    old_price: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
    )

    stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    product_color = relationship(
        "ProductColor",
        back_populates="variants",
    )

    size = relationship(
        "Size",
        back_populates="variants",
    )