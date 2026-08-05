from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
)


class NotificationBase(BaseModel):
    title: str

    message: str

    type: str


class NotificationCreate(NotificationBase):
    user_id: int


class NotificationUpdate(BaseModel):
    title: str | None = None

    message: str | None = None

    type: str | None = None

    is_read: bool | None = None


class NotificationRead(NotificationBase):
    id: int

    user_id: int

    is_read: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )