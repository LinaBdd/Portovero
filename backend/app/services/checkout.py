from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.address import Address
from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.product_variant import ProductVariant
from app.models.shipping_method import ShippingMethod

from app.schemas.checkout import CheckoutRequest


def checkout(
    db: Session,
    data: CheckoutRequest,
):
    # Adresse
    address = (
        db.query(Address)
        .filter(
            Address.id == data.address_id,
            Address.user_id == data.user_id,
        )
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found.",
        )

    # Livraison
    shipping = (
        db.query(ShippingMethod)
        .filter(
            ShippingMethod.id == data.shipping_method_id,
            ShippingMethod.is_active == True,
        )
        .first()
    )

    if not shipping:
        raise HTTPException(
            status_code=404,
            detail="Shipping method not found.",
        )

    # Panier
    cart_items = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == data.user_id
        )
        .all()
    )

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty.",
        )

    subtotal = Decimal("0.00")
    discount = Decimal("0.00")

    variants = {}

    # Vérification des variantes + calcul du sous-total
    for item in cart_items:

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id == item.product_variant_id
            )
            .first()
        )

        if not variant:
            raise HTTPException(
                status_code=404,
                detail=f"Variant {item.product_variant_id} not found.",
            )

        if variant.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {variant.sku}.",
            )

        variants[item.product_variant_id] = variant

        subtotal += variant.price * item.quantity

    shipping_cost = shipping.base_price
    total = subtotal + shipping_cost - discount

    try:

        # Création de la commande
        db_order = Order(
            user_id=data.user_id,

            first_name=address.first_name,
            last_name=address.last_name,
            phone=address.phone,
            email=address.user.email,

            address=address.address,
            wilaya=address.wilaya.name,
            commune=address.commune.name,

            shipping_method=shipping.name,

            subtotal=subtotal,
            shipping_cost=shipping_cost,
            discount=discount,
            total=total,

            payment_method=data.payment_method,
            payment_status="pending",

            coupon_code=data.coupon_code,

            status="pending",

            notes=data.notes,
        )

        db.add(db_order)
        db.flush()

        # Création des OrderItems
        for item in cart_items:

            variant = variants[item.product_variant_id]

            order_item = OrderItem(
                order_id=db_order.id,

                product_variant_id=variant.id,

                product_name=variant.product_color.product.name,
                color=variant.product_color.color.name,
                size=variant.size.name,

                quantity=item.quantity,

                unit_price=variant.price,
                total_price=variant.price * item.quantity,
            )

            db.add(order_item)

            # Mise à jour du stock
            variant.stock -= item.quantity

        # Paiement
        payment = Payment(
            order_id=db_order.id,
            method=data.payment_method,
            amount=total,
            status="pending",
        )

        db.add(payment)

        # Vider le panier
        (
            db.query(CartItem)
            .filter(
                CartItem.user_id == data.user_id
            )
            .delete()
        )

        db.commit()
        db.refresh(db_order)

        return db_order

    except Exception:
        db.rollback()
        raise