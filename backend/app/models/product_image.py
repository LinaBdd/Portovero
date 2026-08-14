from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.core import Base


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    product_color_id: Mapped[int] = mapped_column(
        ForeignKey(
            "product_colors.id",
            ondelete="CASCADE",
        ),
        index=True,
        nullable=False,
    )

    image_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    alt: Mapped[str | None] = mapped_column(
        String(255),
    )

    position: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )



    product_color = relationship(
        "ProductColor",
        back_populates="images",
    )