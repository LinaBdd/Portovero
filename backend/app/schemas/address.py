from pydantic import (
    BaseModel,
    ConfigDict,
)


from pydantic import BaseModel, ConfigDict, Field


class AddressBase(BaseModel):
    label: str | None = Field(default=None, max_length=50)

    first_name: str = Field(min_length=2, max_length=100)
    last_name: str = Field(min_length=2, max_length=100)

    phone: str = Field(min_length=8, max_length=20)

    address: str = Field(min_length=5, max_length=255)

    wilaya_id: int
    commune_id: int

    postal_code: str | None = Field(default=None, max_length=20)

    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    label: str | None = None

    first_name: str | None = None
    last_name: str | None = None

    phone: str | None = None

    address: str | None = None

    wilaya_id: int | None = None
    commune_id: int | None = None

    postal_code: str | None = None

    is_default: bool | None = None


class AddressRead(AddressBase):
    id: int
    user_id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


class AddressList(BaseModel):
    total: int
    items: list[AddressRead]