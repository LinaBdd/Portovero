from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.user import User
from app.models.wishlist import Wishlist


def get_user_wishlist(
    db: Session,
    user_id: int,
):
    return (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user_id,
        )
        .all()
    )


def add_to_wishlist(
    db: Session,
    user_id: int,
    product_id: int,
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found.",
        )

    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user_id,
            Wishlist.product_id == product_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Product already in wishlist.",
        )

    wishlist = Wishlist(
        user_id=user_id,
        product_id=product_id,
    )

    db.add(wishlist)

    db.commit()

    db.refresh(wishlist)

    return wishlist


def remove_from_wishlist(
    db: Session,
    user_id: int,
    product_id: int,
):
    wishlist = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user_id,
            Wishlist.product_id == product_id,
        )
        .first()
    )

    if not wishlist:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found.",
        )

    db.delete(wishlist)

    db.commit()

    return {
        "message": "Product removed from wishlist.",
    }