from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)
from typing import Literal


class RegisterRequest(BaseModel):
    first_name: str = Field(
        min_length=2,
        max_length=50,
    )

    last_name: str = Field(
        min_length=2,
        max_length=50,
    )

    phone: str = Field(
        min_length=10,
        max_length=20,
    )

    email: EmailStr | None = None

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class LoginRequest(BaseModel):
    phone: str

    password: str


class Token(BaseModel):
    access_token: str

    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int

    phone: str

    is_admin: bool


class ChangePasswordRequest(BaseModel):
    current_password: str

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class RefreshTokenRequest(BaseModel):
    refresh_token: str





class AdminRegisterRequest(RegisterRequest):
    role: Literal[
        "admin",
        "manager",
        "employee",
        "customer",
    ]