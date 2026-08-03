from fastapi import (
    APIRouter,
    Depends,
    status,
)

from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.session import get_db

from app.models.user import User

from app.schemas.auth import RegisterRequest
from app.schemas.user import UserRead

from app.services.auth import register_admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
def admin_register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return register_admin(
        db=db,
        data=data,
    )