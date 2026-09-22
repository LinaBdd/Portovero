from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.core import Base


class SiteSetting(Base):
    """Paramètre de contenu du site (clé/valeur), géré depuis l'admin."""

    __tablename__ = "site_settings"

    key: Mapped[str] = mapped_column(String(100), primary_key=True)

    value: Mapped[str] = mapped_column(Text, default="", nullable=False)

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
