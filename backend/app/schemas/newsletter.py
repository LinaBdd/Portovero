from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
)


class NewsletterBase(BaseModel):
    email: EmailStr | None = None

    phone: str | None = None


class NewsletterCreate(NewsletterBase):
    pass


class NewsletterUpdate(BaseModel):
    subscribed: bool


class NewsletterRead(NewsletterBase):
    id: int

    subscribed: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )