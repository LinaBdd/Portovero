from fastapi import (
    APIRouter,
    Depends,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.user import User

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ChangePasswordRequest,
    Token,
)

from app.schemas.user import UserRead

from app.services.auth import (
    register,
    login,
    change_password,
)

from app.auth.dependencies import (
    get_current_user,
)
from app.schemas.auth import AdminRegisterRequest

from app.auth.dependencies import get_current_admin

from app.services.auth import register_admin



router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    return register(
        db=db,
        data=data,
    )


@router.post(
    "/login",
    response_model=Token,
)
def login_user(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    return login(
        db=db,
        data=data,
    )


@router.get(
    "/me",
    response_model=UserRead,
)
def me(
    current_user: User = Depends(
        get_current_user,
    ),
):
    return current_user


@router.patch(
    "/change-password",
    status_code=status.HTTP_204_NO_CONTENT,
)
def update_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    change_password(
        db=db,
        user=current_user,
        data=data,
    )


@router.post(
    "/admin/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
def admin_register(
    data: AdminRegisterRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return register_admin(
        db=db,
        data=data,
    )    