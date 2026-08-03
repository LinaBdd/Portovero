from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ColorBase(BaseModel):
    name: str
    hex_code: str


class ColorCreate(ColorBase):
    pass


class ColorUpdate(BaseModel):
    name: str | None = None
    hex_code: str | None = None


class ColorRead(ColorBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ColorList(BaseModel):
    total: int
    items: list[ColorRead]