from pydantic import BaseModel, ConfigDict


class ProductImageBase(BaseModel):
    product_color_id: int
    image_url: str
    alt: str | None = None
    position: int = 0
    is_primary: bool = False


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageUpdate(BaseModel):
    image_url: str | None = None
    alt: str | None = None
    position: int | None = None
    is_primary: bool | None = None


class ProductImageRead(ProductImageBase):
    id: int

    model_config = ConfigDict(from_attributes=True)