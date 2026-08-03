from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
)

from app.services.cart import (
    add_to_cart,
    get_cart,
    update_cart_item,
    remove_cart_item,
    clear_cart,
)

router = APIRouter(
    prefix="/cart",
    tags=["Cart"],
)


@router.get("/{user_id}")
def cart(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_cart(db, user_id)


@router.post("/{user_id}")
def add(
    user_id: int,
    data: CartItemCreate,
    db: Session = Depends(get_db),
):
    return add_to_cart(db, user_id, data)


@router.put("/{item_id}")
def update(
    item_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_db),
):
    return update_cart_item(
        db,
        item_id,
        data,
    )


@router.delete("/{item_id}")
def delete(
    item_id: int,
    db: Session = Depends(get_db),
):
    remove_cart_item(db, item_id)

    return {
        "message": "Cart item deleted."
    }


@router.delete("/clear/{user_id}")
def clear(
    user_id: int,
    db: Session = Depends(get_db),
):
    clear_cart(
        db,
        user_id,
    )

    return {
        "message": "Cart cleared."
    }