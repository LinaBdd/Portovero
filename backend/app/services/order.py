from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.address import Address
from app.models.shipping_method import ShippingMethod
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.wilaya import Wilaya
from app.models.commune import Commune
from app.models.user import User

from app.schemas.order import (
    OrderCreate,
    OrderUpdate,
    GuestOrderCreate,
)


# ============================================================
# CONSTANTS
# ============================================================

ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
]


# ============================================================
# GET ALL ORDERS
# ============================================================

def get_orders(db: Session):

    return (
        db.query(Order)
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )


# ============================================================
# GET ONE ORDER
# ============================================================

def get_order(
    db: Session,
    order_id: int,
):

    return (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )


# ============================================================
# GET ORDERS BY USER
# ============================================================

def get_orders_by_user(
    db: Session,
    user_id: int,
):

    return (
        db.query(Order)
        .filter(
            Order.user_id == user_id
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )


# ============================================================
# GET ORDERS BY PHONE (GUEST)
# ============================================================

def get_orders_by_phone(
    db: Session,
    phone: str,
):

    return (
        db.query(Order)
        .filter(
            Order.phone == phone
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )


# ============================================================
# CREATE ORDER - AUTH USER
# ============================================================

def create_order(
    db: Session,
    data: OrderCreate,
):

    address = (
        db.query(Address)
        .filter(
            Address.id == data.address_id
        )
        .first()
    )


    if not address:
        return None


    shipping = (
        db.query(ShippingMethod)
        .filter(
            ShippingMethod.id
            == data.shipping_method_id
        )
        .first()
    )


    if not shipping:
        return None


    user = address.user


    shipping_cost = Decimal(
        str(shipping.base_price)
    )


    db_order = Order(

        user_id=address.user_id,

        first_name=address.first_name,
        last_name=address.last_name,

        phone=address.phone,

        email=(
            user.email
            if user
            else None
        ),


        address=address.address,

        wilaya=address.wilaya.name,

        commune=address.commune.name,


        shipping_method=shipping.name,


        subtotal=Decimal("0"),

        shipping_cost=shipping_cost,

        discount=Decimal("0"),

        total=shipping_cost,


        status="pending",


        payment_method=data.payment_method,

        payment_status="pending",


        coupon_code=data.coupon_code,

        notes=data.notes,
    )


    db.add(db_order)

    db.commit()

    db.refresh(db_order)


    return db_order


from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.address import Address
from app.models.shipping_method import ShippingMethod
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.wilaya import Wilaya
from app.models.commune import Commune
from app.models.user import User

from app.schemas.order import (
    OrderCreate,
    OrderUpdate,
    GuestOrderCreate,
)


# ============================================================
# CONSTANTS
# ============================================================

ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
]


# ============================================================
# GET ALL ORDERS
# ============================================================

def get_orders(db: Session):

    return (
        db.query(Order)
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )


# ============================================================
# GET ONE ORDER
# ============================================================

def get_order(
    db: Session,
    order_id: int,
):

    return (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )


# ============================================================
# GET ORDERS BY USER
# ============================================================

def get_orders_by_user(
    db: Session,
    user_id: int,
):

    return (
        db.query(Order)
        .filter(
            Order.user_id == user_id
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )


# ============================================================
# GET ORDERS BY PHONE (GUEST)
# ============================================================

def get_orders_by_phone(
    db: Session,
    phone: str,
):

    return (
        db.query(Order)
        .filter(
            Order.phone == phone
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )


# ============================================================
# CREATE ORDER - AUTH USER
# ============================================================

def create_order(
    db: Session,
    data: OrderCreate,
):

    address = (
        db.query(Address)
        .filter(
            Address.id == data.address_id
        )
        .first()
    )


    if not address:
        return None


    shipping = (
        db.query(ShippingMethod)
        .filter(
            ShippingMethod.id
            == data.shipping_method_id
        )
        .first()
    )


    if not shipping:
        return None


    user = address.user


    shipping_cost = Decimal(
        str(shipping.base_price)
    )


    db_order = Order(

        user_id=address.user_id,

        first_name=address.first_name,
        last_name=address.last_name,

        phone=address.phone,

        email=(
            user.email
            if user
            else None
        ),


        address=address.address,

        wilaya=address.wilaya.name,

        commune=address.commune.name,


        shipping_method=shipping.name,


        subtotal=Decimal("0"),

        shipping_cost=shipping_cost,

        discount=Decimal("0"),

        total=shipping_cost,


        status="pending",


        payment_method=data.payment_method,

        payment_status="pending",


        coupon_code=data.coupon_code,

        notes=data.notes,
    )


    db.add(db_order)

    db.commit()

    db.refresh(db_order)


    return db_order



# ============================================================
# UPDATE ORDER
# ============================================================

def update_order(
    db: Session,
    order_id: int,
    data: OrderUpdate,
):

    db_order = get_order(
        db=db,
        order_id=order_id,
    )


    if not db_order:
        return None


    values = data.model_dump(
        exclude_unset=True
    )


    # --------------------------------------------
    # Validate status
    # --------------------------------------------

    if "status" in values:

        if values["status"] not in ORDER_STATUSES:

            raise HTTPException(
                status_code=400,
                detail="Invalid order status."
            )


    # --------------------------------------------
    # Update fields
    # --------------------------------------------

    for key, value in values.items():

        setattr(
            db_order,
            key,
            value
        )


    db.commit()

    db.refresh(db_order)


    return db_order



# ============================================================
# CANCEL ORDER
# ============================================================

def cancel_order(
    db: Session,
    order_id: int,
):

    db_order = get_order(
        db=db,
        order_id=order_id,
    )


    if not db_order:
        return None


    db_order.status = "cancelled"


    db.commit()

    db.refresh(db_order)


    return db_order




# ============================================================
# CREATE GUEST ORDER
# ============================================================

def create_guest_order(
    db: Session,
    data: GuestOrderCreate,
):

    # ========================================================
    # VALIDATE ITEMS
    # ========================================================

    if not data.items:

        raise HTTPException(
            status_code=400,
            detail="Order must contain at least one item.",
        )


    # ========================================================
    # SHIPPING
    # ========================================================

    shipping = (
        db.query(ShippingMethod)
        .filter(
            ShippingMethod.id
            == data.shipping_method_id
        )
        .first()
    )


    if not shipping:

        raise HTTPException(
            status_code=404,
            detail="Shipping method not found.",
        )



    # ========================================================
    # WILAYA
    # ========================================================

    wilaya = (
        db.query(Wilaya)
        .filter(
            Wilaya.id
            == data.wilaya_id
        )
        .first()
    )


    if not wilaya:

        raise HTTPException(
            status_code=404,
            detail="Wilaya not found.",
        )



    # ========================================================
    # COMMUNE
    # ========================================================

    commune = (
        db.query(Commune)
        .filter(
            Commune.id == data.commune_id,
            Commune.wilaya_id == data.wilaya_id,
        )
        .first()
    )


    if not commune:

        raise HTTPException(
            status_code=404,
            detail=(
                "Commune not found or does not belong "
                "to this wilaya."
            ),
        )



    # ========================================================
    # USER / GUEST
    # ========================================================

    user = (
        db.query(User)
        .filter(
            User.phone == data.phone
        )
        .first()
    )


    if not user:


        user = User(

            first_name=data.first_name,

            last_name=data.last_name,

            phone=data.phone,

            email=None,

            password_hash=None,


            is_registered=False,

            is_admin=False,

            marketing_consent=False,

            is_active=True,
        )


        db.add(user)

        db.flush()



    else:


        if user.is_registered:

            raise HTTPException(
                status_code=400,
                detail=(
                    "An account already exists with "
                    "this phone number. Please login."
                ),
            )


        user.first_name = data.first_name

        user.last_name = data.last_name



    # ========================================================
    # ADDRESS
    # ========================================================


    old_address = (
        db.query(Address)
        .filter(
            Address.user_id == user.id,
            Address.is_default == True,
        )
        .first()
    )


    if old_address:

        old_address.is_default = False



    address = Address(

        user_id=user.id,

        wilaya_id=data.wilaya_id,

        commune_id=data.commune_id,


        first_name=data.first_name,

        last_name=data.last_name,


        phone=data.phone,


        address=data.address,


        is_default=True,
    )


    db.add(address)
    db.flush()

  # VALIDATE PRODUCTS + CALCUL SUBTOTAL
    # ========================================================

    subtotal = Decimal("0")

    validated_items = []


    for item in data.items:


        if item.quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid quantity."
            )


        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id,
                Product.is_active == True,
            )
            .first()
        )


        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found."
            )


        variant = None


        # ====================================================
        # VARIANT
        # ====================================================

        if item.product_variant_id:


            variant = (
                db.query(ProductVariant)
                .filter(
                    ProductVariant.id 
                    == item.product_variant_id
                )
                .first()
            )


            if not variant:
                raise HTTPException(
                    status_code=404,
                    detail="Variant not found."
                )


            if variant.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail="Not enough stock."
                )


            price = Decimal(
                str(variant.price)
            )


        else:


            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail="Not enough stock."
                )


            price = Decimal(
                str(product.base_price)
            )



        item_total = price * item.quantity

        subtotal += item_total


        validated_items.append(
            {
                "product": product,
                "variant": variant,
                "quantity": item.quantity,
                "price": price,
            }
        )       

    # ========================================================
    # TOTAL
    # ========================================================

    shipping_cost = Decimal(
        str(shipping.base_price)
    )


    discount = Decimal("0")


    total = (
        subtotal
        + shipping_cost
        - discount
    )


    # ========================================================
    # CREATE ORDER
    # ========================================================


    order = Order(

        user_id=user.id,

        first_name=data.first_name,
        last_name=data.last_name,

        phone=data.phone,

        email=None,


        address=data.address,

        wilaya=wilaya.name,

        commune=commune.name,


        shipping_method=shipping.name,


        subtotal=subtotal,

        shipping_cost=shipping_cost,

        discount=discount,

        total=total,


        status="pending",


        payment_method=data.payment_method,

        payment_status="pending",


        coupon_code=data.coupon_code,

        notes=data.notes,
    )

    db.add(order)

    db.flush()


    # ========================================================
    # CREATE ORDER ITEMS
    # ========================================================

    for item_data in validated_items:

        product = item_data["product"]
        variant = item_data["variant"]
        quantity = item_data["quantity"]
        price = item_data["price"]


        order_item = OrderItem(

            order_id=order.id,


            product_variant_id=(
                variant.id
                if variant
                else None
            ),


            product_name=product.name,


            color=(
                variant.product_color.color.name
                if variant
                and variant.product_color
                and variant.product_color.color
                else None
            ),


            size=(
                variant.size.name
                if variant
                and variant.size
                else None
            ),


            product_image=None,


            quantity=quantity,


            unit_price=price,


            total_price=(
                price * quantity
            ),
        )


        db.add(order_item)


        # ===============================
        # UPDATE STOCK
        # ===============================

        if variant:

            variant.stock -= quantity

        else:

            product.stock -= quantity



    # ========================================================
    # COMMIT
    # ========================================================

    try:

        db.commit()


    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to create order."
        )



    db.refresh(order)


    return order