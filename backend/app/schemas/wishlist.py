from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
)


class WishlistBase(BaseModel):
    user_id: int

    product_id: int


class WishlistCreate(WishlistBase):
    pass


class WishlistRead(WishlistBase):
    id: int

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )