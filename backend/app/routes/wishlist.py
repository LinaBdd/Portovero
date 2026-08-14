from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.wishlist import WishlistRead

from app.services.wishlist import (
    add_to_wishlist,
    get_user_wishlist,
    remove_from_wishlist,
)

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"],
)


# ============================================================
# MY WISHLIST
# ============================================================

@router.get(
    "/",
    response_model=list[WishlistRead],
)
def read_my_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_wishlist(
        db,
        current_user.id,
    )


# ============================================================
# ADD
# ============================================================

@router.post(
    "/{product_id}",
    response_model=WishlistRead,
)
def create(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return add_to_wishlist(
        db,
        current_user.id,
        product_id,
    )


# ============================================================
# REMOVE
# ============================================================

@router.delete(
    "/{product_id}",
)
def delete(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return remove_from_wishlist(
        db,
        current_user.id,
        product_id,
    )