from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.core import Base


class ContentItem(Base):
    """Bloc de contenu éditable : faq, testimonial, feature, value, instagram."""

    __tablename__ = "content_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    type: Mapped[str] = mapped_column(String(30), nullable=False, index=True)

    title: Mapped[str] = mapped_column(String(255), default="", nullable=False)

    subtitle: Mapped[str | None] = mapped_column(String(255), nullable=True)

    text: Mapped[str | None] = mapped_column(Text, nullable=True)

    image: Mapped[str | None] = mapped_column(String(500), nullable=True)

    link: Mapped[str | None] = mapped_column(String(500), nullable=True)

    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)

    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)

    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
