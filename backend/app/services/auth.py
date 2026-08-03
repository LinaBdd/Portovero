from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ChangePasswordRequest,
    Token,
)


from app.auth.hashing import (
    hash_password,
    verify_password,
)

from app.auth.jwt import create_access_token


def register(
    db: Session,
    data: RegisterRequest,
) -> User:

    existing_user = (
        db.query(User)
        .filter(User.phone == data.phone)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone already registered.",
        )

    if data.email:

        existing_email = (
            db.query(User)
            .filter(User.email == data.email)
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered.",
            )

    user = User(
      first_name=data.first_name,
      last_name=data.last_name,
      phone=data.phone,
      email=data.email,
      password_hash=hash_password(data.password),
      is_registered=True,
      is_admin=False,
      is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login(
    db: Session,
    data: LoginRequest,
) -> Token:

    user = (
        db.query(User)
        .filter(User.phone == data.phone)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )

    if not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "phone": user.phone,
            "is_admin": user.is_admin,
        }
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
    )


def change_password(
    db: Session,
    user: User,
    data: ChangePasswordRequest,
) -> None:

    if not verify_password(
        data.current_password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    user.password_hash = hash_password(
        data.new_password
    )

    db.commit()


def get_user_by_id(
        
    db: Session,
    user_id: int,
) -> User:

    user = db.get(
        User,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user




def register_admin(
    db: Session,
    data: RegisterRequest,
) -> User:

    # Vérifier téléphone
    existing_user = (
        db.query(User)
        .filter(User.phone == data.phone)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone already registered.",
        )

    # Vérifier email
    if data.email:

        existing_email = (
            db.query(User)
            .filter(User.email == data.email)
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered.",
            )

    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
        email=data.email,
        password_hash=hash_password(data.password),
        is_registered=True,
        is_admin=True,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user