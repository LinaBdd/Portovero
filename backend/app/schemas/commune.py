from pydantic import (
    BaseModel,
    ConfigDict,
)


class CommuneBase(BaseModel):
    wilaya_id: int

    name: str

    postal_code: str | None = None


class CommuneCreate(CommuneBase):
    pass


class CommuneUpdate(BaseModel):
    wilaya_id: int | None = None

    name: str | None = None

    postal_code: str | None = None


class CommuneRead(CommuneBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


class CommuneList(BaseModel):
    total: int

    items: list[CommuneRead]