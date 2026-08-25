from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
)


class UserBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: EmailStr | None = None
    marketing_consent: bool = False


class UserCreate(UserBase):
    password: str | None = None


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    marketing_consent: bool | None = None


class UserRead(UserBase):
    id: int

    is_registered: bool
    is_admin: bool
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class UserList(BaseModel):
    total: int
    items: list[UserRead]


class UserDetail(UserRead):
    """
    Informations détaillées visibles par l'administrateur.

    On n'expose volontairement PAS password_hash.
    """
    pass