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
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    wilaya_id: Mapped[int] = mapped_column(
        ForeignKey(
            "wilayas.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )

    commune_id: Mapped[int] = mapped_column(
        ForeignKey(
            "communes.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )

    label: Mapped[str | None] = mapped_column(
        String(50),
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    address: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    postal_code: Mapped[str | None] = mapped_column(
        String(20),
    )

    is_default: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="addresses",
    )

    wilaya = relationship(
        "Wilaya",
        back_populates="addresses",
    )

    commune = relationship(
        "Commune",
        back_populates="addresses",
    )