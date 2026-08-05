from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
)


class BannerBase(BaseModel):
    title: str

    subtitle: str | None = None

    description: str | None = None

    image_url: str

    button_text: str | None = None

    button_link: str | None = None

    position: int = 1

    is_active: bool = True


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title: str | None = None

    subtitle: str | None = None

    description: str | None = None

    image_url: str | None = None

    button_text: str | None = None

    button_link: str | None = None

    position: int | None = None

    is_active: bool | None = None


class BannerRead(BannerBase):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )