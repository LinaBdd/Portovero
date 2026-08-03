from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    description: str | None = None
    image: str | None = None

    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image: str | None = None

    is_active: bool | None = None


class CategoryRead(CategoryBase):
    id: int
    slug: str

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class CategoryList(BaseModel):
    total: int
    items: list[CategoryRead]