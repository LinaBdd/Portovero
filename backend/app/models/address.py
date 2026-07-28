from sqlalchemy import (
    Boolean,
    ForeignKey,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.core import Base


class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    label: Mapped[str | None] = mapped_column(
        String(50),
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
    )

    phone: Mapped[str] = mapped_column(
        String(20),
    )

    address: Mapped[str] = mapped_column(
        String(255),
    )

    city: Mapped[str] = mapped_column(
        String(100),
    )

    postal_code: Mapped[str | None] = mapped_column(
        String(20),
    )

    is_default: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    user = relationship(
        "User",
        back_populates="addresses",
    )