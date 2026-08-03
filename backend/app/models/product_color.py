from sqlalchemy import (
    ForeignKey,
    UniqueConstraint,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.core import Base


class ProductColor(Base):
    __tablename__ = "product_colors"

    __table_args__ = (
        UniqueConstraint(
            "product_id",
            "color_id",
            name="uq_product_color",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey(
            "products.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    color_id: Mapped[int] = mapped_column(
        ForeignKey(
            "colors.id",
        ),
        nullable=False,
    )

    product = relationship(
        "Product",
        back_populates="colors",
    )

    color = relationship(
        "Color",
        back_populates="products",
    )

    images = relationship(
        "ProductImage",
        back_populates="product_color",
        cascade="all, delete-orphan",
    )

    variants = relationship(
        "ProductVariant",
        back_populates="product_color",
        cascade="all, delete-orphan",
    )