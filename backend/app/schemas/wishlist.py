from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
)


class WishlistBase(BaseModel):
    product_id: int


class WishlistCreate(WishlistBase):
    user_id: int | None = None
    session_id: str | None = None


class WishlistUpdate(BaseModel):
    pass


class WishlistRead(WishlistBase):
    id: int

    user_id: int | None = None
    session_id: str | None = None

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )