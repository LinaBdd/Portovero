from decimal import Decimal

from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload
from fastapi import HTTPException, status

import re
import unicodedata

from app.models.product import Product
from app.models.product_color import ProductColor
from app.models.product_category import ProductCategory
from app.models.category import Category

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
)
from app.models.product_variant import ProductVariant


def slugify(value: str) -> str:
    value = str(value)
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value.lower())
    value = re.sub(r"[\s_-]+", "-", value).strip("-")
    return value


def generate_sku(db: Session) -> str:
    last_product = (
        db.query(Product)
        .order_by(Product.id.desc())
        .first()
    )

    if not last_product:
        return "POR-000001"

    return f"POR-{last_product.id + 1:06d}"


def generate_unique_slug(
    db: Session,
    name: str,
) -> str:

    slug = slugify(name)
    original_slug = slug

    counter = 1

    while (
        db.query(Product)
        .filter(Product.slug == slug)
        .first()
    ):
        slug = f"{original_slug}-{counter}"
        counter += 1

    return slug


def create_product(
    db: Session,
    data: ProductCreate,
) -> Product:

    product = Product(
        name=data.name,
        slug=generate_unique_slug(db, data.name),
        sku=generate_sku(db),
        description=data.description,
        base_price=data.base_price,
        compare_at_price=data.compare_at_price,
        stock=data.stock,
        weight=data.weight,
        gender=data.gender,
        is_active=data.is_active,
        is_featured=data.is_featured,
        is_new=data.is_new,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def get_product(
    db: Session,
    product_id: int,
) -> Product:

    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return product


def get_product_by_slug(
    db: Session,
    slug: str,
) -> Product:

    product = (
        db.query(Product)
        .options(
            selectinload(Product.colors)
            .selectinload(ProductColor.images)
        )
        .filter(
            Product.slug == slug,
            Product.is_active == True,
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return product


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 20,
) -> dict:

    query = (
        db.query(Product)
        .options(
            selectinload(Product.categories)
            .selectinload(ProductCategory.category),

            selectinload(Product.colors)
            .selectinload(ProductColor.images),
        )
        .filter(Product.is_active == True)
    )

    total = query.count()

    products = (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )

    for product in products:
        product.category_list = load_product_categories(
            product
        )

    return {
        "total": total,
        "items": products,
    }


from sqlalchemy.orm import joinedload


from sqlalchemy.orm import joinedload

from app.models.product_color import ProductColor

def get_featured_products(
    db: Session,
    limit: int = 8,
) -> list[Product]:

    return (
        db.query(Product)
        .filter(
            Product.is_active == True,
            Product.is_featured == True,
        )
        .limit(limit)
        .all()
    )


def get_new_products(
    db: Session,
    limit: int = 8,
) -> list[Product]:

    return (
        db.query(Product)
        .filter(
            Product.is_active == True,
            Product.is_new == True,
        )
        .order_by(Product.created_at.desc())
        .limit(limit)
        .all()
    )


def search_products(
    db: Session,
    query: str,
    skip: int = 0,
    limit: int = 20,
) -> dict:

    search = (
        db.query(Product)
        .filter(
            Product.is_active == True,
            or_(
                Product.name.ilike(f"%{query}%"),
                Product.description.ilike(f"%{query}%"),
                Product.sku.ilike(f"%{query}%"),
            ),
        )
    )

    total = search.count()

    products = (
        search
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": products,
    }


def update_product(
    db: Session,
    product_id: int,
    data: ProductUpdate,
) -> Product:

    product = get_product(db, product_id)

    values = data.model_dump(
        exclude_unset=True,
    )

    if (
        "name" in values
        and values["name"] != product.name
    ):
        values["slug"] = generate_unique_slug(
            db,
            values["name"],
        )

    for key, value in values.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


def update_stock(
    db: Session,
    product_id: int,
    quantity_to_remove: int,
) -> Product:

    product = get_product(db, product_id)

    if product.stock < quantity_to_remove:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock.",
        )

    product.stock -= quantity_to_remove

    db.commit()
    db.refresh(product)

    return product


def delete_product(
    db: Session,
    product_id: int,
) -> None:

    product = get_product(db, product_id)

    db.delete(product)
    db.commit()


def filter_products(
    db: Session,
    gender: str | None = None,
    category: str | None = None,
    material_id: int | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
    skip: int = 0,
    limit: int = 20,
) -> dict:

    query = (
        db.query(Product)
        .options(
            selectinload(Product.categories)
            .selectinload(ProductCategory.category),

            selectinload(Product.colors)
            .selectinload(ProductColor.images),
        )
        .filter(Product.is_active == True)
    )

    # =====================================================
    # GENDER
    # =====================================================

    if gender:
        query = query.filter(
            Product.gender.ilike(gender)
        )

    # =====================================================
    # MATERIAL
    # =====================================================

    if material_id:
        query = query.filter(
            Product.material_id == material_id
        )

    # =====================================================
    # PRICE
    # =====================================================

    if min_price is not None:
        query = query.filter(
            Product.base_price >= min_price
        )

    if max_price is not None:
        query = query.filter(
            Product.base_price <= max_price
        )

    # =====================================================
    # CATEGORY
    # =====================================================

    if category:
        query = (
            query
            .join(
                ProductCategory,
                ProductCategory.product_id == Product.id,
            )
            .join(
                Category,
                Category.id == ProductCategory.category_id,
            )
            .filter(
                Category.slug == category
            )
        )

    # =====================================================
    # TOTAL
    # =====================================================

    total = query.distinct().count()

    # =====================================================
    # PRODUCTS
    # =====================================================

    products = (
        query
        .distinct()
        .offset(skip)
        .limit(limit)
        .all()
    )

    # =====================================================
    # CATEGORY LIST
    # =====================================================

    for product in products:
        product.category_list = load_product_categories(
            product
        )

    return {
        "total": total,
        "items": products,
    }

def load_product_categories(
    product: Product,
) -> list[Category]:
    return [
        pc.category
        for pc in product.categories
        if pc.category is not None
    ]