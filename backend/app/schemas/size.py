from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class SizeBase(BaseModel):
    name: str
    display_order: int = Field(default=0, ge=0)


class SizeCreate(SizeBase):
    pass


class SizeUpdate(BaseModel):
    name: str | None = None
    display_order: int | None = Field(default=None, ge=0)


class SizeRead(SizeBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class SizeList(BaseModel):
    total: int
    items: list[SizeRead]