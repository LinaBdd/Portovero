from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
)


class NewsletterBase(BaseModel):
    email: EmailStr | None = None

    phone: str | None = None

    is_active: bool = True


class NewsletterCreate(NewsletterBase):
    pass


class NewsletterUpdate(BaseModel):
    email: EmailStr | None = None

    phone: str | None = None

    is_active: bool | None = None


class NewsletterRead(NewsletterBase):
    id: int

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )