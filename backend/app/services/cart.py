from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart_item import CartItem
from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
)


def add_to_cart(
    db: Session,
    user_id: int,
    data: CartItemCreate,
):

    item = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id,
            CartItem.product_variant_id == data.product_variant_id,
        )
        .first()
    )

    if item:
        item.quantity += data.quantity

    else:
        item = CartItem(
            user_id=user_id,
            product_variant_id=data.product_variant_id,
            quantity=data.quantity,
        )

        db.add(item)

    db.commit()
    db.refresh(item)

    return item


def get_cart(
    db: Session,
    user_id: int,
):

    return (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id,
        )
        .all()
    )


def update_cart_item(
    db: Session,
    item_id: int,
    data: CartItemUpdate,
):

    item = db.get(CartItem, item_id)

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found.",
        )

    item.quantity = data.quantity

    db.commit()
    db.refresh(item)

    return item


def remove_cart_item(
    db: Session,
    item_id: int,
):

    item = db.get(CartItem, item_id)

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found.",
        )

    db.delete(item)
    db.commit()


def clear_cart(
    db: Session,
    user_id: int,
):

    (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id,
        )
        .delete()
    )

    db.commit()