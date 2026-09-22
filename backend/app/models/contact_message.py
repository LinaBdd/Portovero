from sqlalchemy import Boolean, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.core import Base


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(150), nullable=False)

    email: Mapped[str] = mapped_column(String(255), nullable=False)

    message: Mapped[str] = mapped_column(Text, nullable=False)

    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
