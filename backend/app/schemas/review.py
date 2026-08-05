from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ReviewBase(BaseModel):
    rating: int = Field(
        ge=1,
        le=5,
    )

    comment: str | None = None


class ReviewCreate(ReviewBase):
    user_id: int

    product_id: int


class ReviewUpdate(BaseModel):
    rating: int | None = Field(
        default=None,
        ge=1,
        le=5,
    )

    comment: str | None = None

    is_visible: bool | None = None


class ReviewRead(ReviewBase):
    id: int

    user_id: int

    product_id: int

    is_visible: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ProductRating(BaseModel):
    average_rating: float

    total_reviews: int