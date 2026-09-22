from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SettingsUpdate(BaseModel):
    settings: dict[str, str]


class ContentItemBase(BaseModel):
    type: str
    title: str = ""
    subtitle: str | None = None
    text: str | None = None
    image: str | None = None
    link: str | None = None
    icon: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    position: int = 0
    is_active: bool = True


class ContentItemCreate(ContentItemBase):
    pass


class ContentItemUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    text: str | None = None
    image: str | None = None
    link: str | None = None
    icon: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    position: int | None = None
    is_active: bool | None = None


class ContentItemRead(ContentItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)


class ContactMessageRead(BaseModel):
    id: int
    name: str
    email: str
    message: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
