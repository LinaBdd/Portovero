from pydantic import (
    BaseModel,
    ConfigDict,
)


class ProductColorBase(BaseModel):
    product_id: int
    color_id: int


class ProductColorCreate(ProductColorBase):
    pass


class ProductColorUpdate(BaseModel):
    color_id: int | None = None


class ProductColorRead(ProductColorBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


class ProductColorList(BaseModel):
    total: int
    items: list[ProductColorRead]