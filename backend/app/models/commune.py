from sqlalchemy import (
    ForeignKey,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.core import Base


class Commune(Base):
    __tablename__ = "communes"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    code: Mapped[int | None] = mapped_column(
        unique=True,
        nullable=True,
    )

    wilaya_id: Mapped[int] = mapped_column(
        ForeignKey(
            "wilayas.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    name_ar: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    daira: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    daira_ar: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    postal_code: Mapped[str | None] = mapped_column(
        String(20),
    )

    wilaya = relationship(
        "Wilaya",
        back_populates="communes",
    )

    addresses = relationship(
        "Address",
        back_populates="commune",
    )