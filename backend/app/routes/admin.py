from decimal import Decimal
from datetime import datetime
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, Path, UploadFile, status, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_admin

# Modèles
from app.models.product import Product
from app.models.product_color import ProductColor
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant
from app.models.product_category import ProductCategory
from app.models.user import User
from app.models.order import Order
from app.models.payment import Payment

# Schémas
from app.schemas.admin import (
    AdminProductCreate,
    AdminProductUpdate,
    AdminProductColorCreate,
    AdminProductVariantCreate,
    AdminProductImageCreate,
    DashboardStats,
    MonthlyStats,
    StatusStats,
    PaymentStats,
    StockAlertProduct,
    ColorUpdate,
    VariantUpdate,
    ImageUpdate,
)
from app.schemas.product import ProductRead
from app.schemas.user import UserRead,UserList,UserDetail
from app.schemas.order import OrderRead
from app.schemas.payment import PaymentRead

# Services
from app.services.admin import (
    dashboard,
    create_product_admin,
    update_product_admin,
)
from app.services.product import get_product, delete_product, update_variant_stock
from app.models.order_item import OrderItem

router = APIRouter(prefix="/admin", tags=["Admin"])


# ============================================================
# CLASSES POUR LES REQUÊTES
# ============================================================

class PaymentStatusUpdate(BaseModel):
    payment_status: str


# ============================================================
# ROUTES: DASHBOARD
# ============================================================

@router.get("/dashboard", response_model=DashboardStats)
def read_dashboard(
    low_stock_threshold: int = Query(5, ge=0, description="Seuil de stock faible"),
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Récupère les statistiques du dashboard."""
    return dashboard(db, low_stock_threshold)


@router.post("/dashboard/low-stock-threshold")
def set_low_stock_threshold(
    threshold: int = Query(..., ge=0),
    _: dict = Depends(get_current_admin),
):
    return {
        "message": "Threshold updated",
        "low_stock_threshold": threshold,
    }

# ============================================================
# ROUTES: PRODUCTS (CRUD complet)
# ============================================================

@router.post("/products/create", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product_route(
    data: AdminProductCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Crée un nouveau produit avec toutes ses relations."""
    return create_product_admin(db, data)


@router.put("/products/{product_id}", response_model=ProductRead)
def update_product_route(
    product_id: int,
    data: AdminProductUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Met à jour un produit existant avec toutes ses relations."""
    return update_product_admin(db, product_id, data)


@router.get("/products/{product_id}", response_model=ProductRead)
def get_product_admin_route(
    product_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Récupère un produit avec toutes ses relations pour l'admin."""
    return get_product(db, product_id)


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_admin_route(
    product_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Supprime un produit et toutes ses relations."""
    delete_product(db, product_id)
    return None


# ============================================================
# ROUTES: PRODUCT COLORS
# ============================================================

@router.put("/products/colors/{color_id}")
def update_product_color_route(
    color_id: int,
    data: AdminProductColorCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Met à jour une couleur spécifique d'un produit."""
    color = db.query(ProductColor).filter(ProductColor.id == color_id).first()
    if not color:
        raise HTTPException(status_code=404, detail="Color not found")
    
    # Mettre à jour les champs
    if data.color_id:
        color.color_id = data.color_id
    
    db.commit()
    db.refresh(color)
    return color


@router.delete("/products/colors/{color_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_color_route(
    color_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Supprime une couleur d'un produit."""
    color = db.query(ProductColor).filter(ProductColor.id == color_id).first()
    if not color:
        raise HTTPException(status_code=404, detail="Color not found")
    
    db.delete(color)
    db.commit()
    return None


# ============================================================
# ROUTES: PRODUCT VARIANTS
# ============================================================

@router.put("/products/variants/{variant_id}")
def update_product_variant_route(
    variant_id: int,
    data: AdminProductVariantCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Met à jour une variante spécifique."""
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")
    
    variant.size_id = data.size_id
    variant.stock = data.stock
    variant.price = data.price
    variant.old_price = data.old_price
    variant.is_active = data.is_active
    
    db.commit()
    db.refresh(variant)
    
    return variant


@router.delete("/products/variants/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_variant_route(
    variant_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Supprime une variante spécifique."""
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")
    
    db.delete(variant)
    db.commit()
    return None


# ============================================================
# ROUTES: PRODUCT IMAGES
# ============================================================

@router.put("/products/images/{image_id}")
def update_product_image_route(
    image_id: int,
    data: AdminProductImageCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Met à jour une image spécifique."""
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image.image_url = data.url
    image.alt = data.alt
    image.position = data.position
    image.is_primary = data.is_primary
    
    db.commit()
    db.refresh(image)
    
    return image


@router.delete("/products/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_image_route(
    image_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Supprime une image spécifique."""
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    db.delete(image)
    db.commit()
    return None


# ============================================================
# ROUTES: USERS
# ============================================================

@router.get("/users", response_model=list[UserRead])
def get_users_route(
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Récupère la liste des utilisateurs."""
    return db.query(User).all()




# ============================================================
# ROUTES: USERS
# ============================================================

@router.get(
    "/users",
    response_model=UserList,
)
def get_users_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(
        None,
        description="Recherche par nom, prénom, email ou téléphone",
    ),
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """
    Récupère la liste des utilisateurs pour l'administration.
    """

    query = db.query(User)

    # --------------------------------------------------------
    # RECHERCHE
    # --------------------------------------------------------

    if search:
        search_value = f"%{search.strip()}%"

        query = query.filter(
            (User.first_name.ilike(search_value))
            | (User.last_name.ilike(search_value))
            | (User.email.ilike(search_value))
            | (User.phone.ilike(search_value))
        )

    # --------------------------------------------------------
    # TOTAL
    # --------------------------------------------------------

    total = query.count()

    # --------------------------------------------------------
    # UTILISATEURS
    # --------------------------------------------------------

    users = (
        query
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": users,
    }


@router.get(
    "/users/{user_id}",
    response_model=UserDetail,
)
def get_user_detail_route(
    user_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """
    Récupère les informations détaillées d'un utilisateur.
    """

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur introuvable",
        )

    return user
# ============================================================
# ROUTES: ORDERS
# ============================================================

@router.get("/orders", response_model=list[OrderRead])
def get_orders_route(
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Récupère la liste des commandes."""
    return db.query(Order).all()


@router.patch("/orders/{order_id}/payment-status")
def change_payment_status_route(
    order_id: int,
    data: PaymentStatusUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Modifie le statut de paiement d'une commande."""

    allowed_statuses = {
        "pending",
        "paid",
        "failed",
        "refunded",
    }

    if data.payment_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Statut de paiement invalide",
        )

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Commande introuvable",
        )

    # 1. Mettre à jour le statut de la commande
    order.payment_status = data.payment_status

    # 2. Chercher le paiement existant
    payment = (
        db.query(Payment)
        .filter(Payment.order_id == order_id)
        .first()
    )

    # 3. Créer le paiement s'il n'existe pas
    if not payment:
        payment = Payment(
            order_id=order.id,
            method=order.payment_method,
            amount=order.total,
            status=data.payment_status,
        )

        db.add(payment)

    # 4. Sinon, synchroniser le paiement existant
    else:
        payment.status = data.payment_status
        payment.method = order.payment_method
        payment.amount = order.total

    db.commit()

    db.refresh(order)
    db.refresh(payment)

    return {
        "message": "Statut paiement modifié",
        "payment_status": order.payment_status,
        "payment": {
            "id": payment.id,
            "order_id": payment.order_id,
            "method": payment.method,
            "amount": payment.amount,
            "status": payment.status,
            "transaction_id": payment.transaction_id,
        },
    }

class OrderStatusUpdate(BaseModel):
    status: str


@router.patch("/orders/{order_id}/status")
def change_order_status_route(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Modifie le statut d'une commande."""

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Commande introuvable",
        )

    allowed_statuses = {
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    }

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Statut invalide: {data.status}",
        )

    order.status = data.status

    db.commit()
    db.refresh(order)

    return {
        "message": "Statut commande modifié",
        "status": order.status,
    }

# ============================================================
# ROUTES: PAYMENTS
# ============================================================

@router.get("/payments", response_model=list[PaymentRead])
def get_payments_route(
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Récupère la liste des paiements."""
    return db.query(Payment).all()



@router.post("/products/images")
def add_product_image_route(
    data: AdminProductImageCreate,
    product_color_id: int = Query(..., description="ID de la couleur du produit"),
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Ajoute une image à une couleur de produit."""
    
    # Vérifier que la couleur existe
    product_color = db.query(ProductColor).filter(ProductColor.id == product_color_id).first()
    if not product_color:
        raise HTTPException(status_code=404, detail="ProductColor not found")
    
    # Créer l'image
    product_image = ProductImage(
        product_color_id=product_color_id,
        image_url=data.url,
        alt=data.alt,
        position=data.position,
        is_primary=data.is_primary
    )
    db.add(product_image)
    db.commit()
    db.refresh(product_image)
    
    return product_image    

class VariantStockUpdate(BaseModel):
    stock: int = Field(ge=0)

@router.patch(
    "/product-variants/{variant_id}/stock"
)
def update_variant_stock_endpoint(
    variant_id: int,
    data: VariantStockUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    return update_variant_stock(
        db,
        variant_id,
        data.stock,
    )


@router.delete(
    "/orders/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commande introuvable",
        )

    # Supprimer les éléments de commande
    db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).delete(synchronize_session=False)

    # Supprimer les paiements liés
    db.query(Payment).filter(
        Payment.order_id == order_id
    ).delete(synchronize_session=False)

    # Supprimer la commande
    db.delete(order)

    db.commit()

    return None