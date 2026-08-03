from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

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


@router.get(
    "/{user_id}",
    response_model=list[WishlistRead],
)
def read_user_wishlist(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_user_wishlist(
        db,
        user_id,
    )


@router.post(
    "/{user_id}/{product_id}",
    response_model=WishlistRead,
)
def create(
    user_id: int,
    product_id: int,
    db: Session = Depends(get_db),
):
    return add_to_wishlist(
        db,
        user_id,
        product_id,
    )


@router.delete(
    "/{user_id}/{product_id}",
)
def delete(
    user_id: int,
    product_id: int,
    db: Session = Depends(get_db),
):
    return remove_from_wishlist(
        db,
        user_id,
        product_id,
    )