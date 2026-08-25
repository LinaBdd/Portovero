from decimal import Decimal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductRead,
    ProductList,
)

from app.services.product import (
    create_product,
    filter_products,
    get_product,
    get_product_by_slug,
    get_products,
    get_featured_products,
    get_new_products,
    search_products,
    update_product,
    delete_product,
    update_variant_stock,
)

from app.auth.dependencies import get_current_admin

from app.models.product import Product
from app.models.category import Category
from app.models.product_category import ProductCategory


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


# ============================================================
# PUBLIC ROUTES
# ============================================================


@router.get(
    "/list",
    response_model=ProductList,
)
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_products(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/featured",
    response_model=list[ProductRead],
)
def featured_products(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return get_featured_products(
        db=db,
        limit=limit,
    )


@router.get(
    "/new",
    response_model=list[ProductRead],
)
def new_products(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return get_new_products(
        db=db,
        limit=limit,
    )


@router.get(
    "/search",
    response_model=ProductList,
)
def search(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return search_products(
        db=db,
        query=q,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/filter",
    response_model=ProductList,
)
def filter_products_route(
    gender: str | None = None,
    category: str | None = None,
    material_id: int | None = None,
    min_price: Decimal | None = Query(None, ge=0),
    max_price: Decimal | None = Query(None, ge=0),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if (
        min_price is not None
        and max_price is not None
        and min_price > max_price
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="min_price cannot be greater than max_price.",
        )

    return filter_products(
        db=db,
        gender=gender,
        category=category,
        material_id=material_id,
        min_price=min_price,
        max_price=max_price,
        skip=skip,
        limit=limit,
    )


# ============================================================
# ADMIN ROUTES
# ============================================================


@router.post(
    "/create",
    response_model=ProductRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: ProductCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    return create_product(
        db=db,
        data=data,
    )


@router.patch(
    "/{product_id:int}",
    response_model=ProductRead,
)
def update(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    return update_product(
        db=db,
        product_id=product_id,
        data=data,
    )


# ============================================================
# VARIANT STOCK
# ============================================================


@router.patch(
    "/variants/{variant_id:int}/stock",
)
def decrease_variant_stock(
    variant_id: int,
    quantity: int = Query(..., gt=0),
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    variant = update_variant_stock(
        db=db,
        variant_id=variant_id,
        quantity_to_remove=quantity,
    )

    db.commit()
    db.refresh(variant)

    return {
        "message": "Variant stock updated.",
        "variant_id": variant.id,
        "sku": variant.sku,
        "stock": variant.stock,
    }


# ============================================================
# DELETE PRODUCT
# ============================================================


@router.delete(
    "/{product_id:int}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    product_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    delete_product(
        db=db,
        product_id=product_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


# ============================================================
# PRODUCT <-> CATEGORY LINKS
# ============================================================


@router.post(
    "/{product_id:int}/categories/{category_id:int}",
    status_code=status.HTTP_201_CREATED,
)
def assign_category(
    product_id: int,
    category_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    product = db.get(
        Product,
        product_id,
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    category = db.get(
        Category,
        category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    existing = (
        db.query(ProductCategory)
        .filter(
            ProductCategory.product_id == product_id,
            ProductCategory.category_id == category_id,
        )
        .first()
    )

    if existing:
        return {
            "message": "Already assigned.",
        }

    link = ProductCategory(
        product_id=product_id,
        category_id=category_id,
    )

    db.add(link)
    db.commit()

    return {
        "message": "Category assigned.",
    }


@router.delete(
    "/{product_id:int}/categories/{category_id:int}",
)
def unassign_category(
    product_id: int,
    category_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    link = (
        db.query(ProductCategory)
        .filter(
            ProductCategory.product_id == product_id,
            ProductCategory.category_id == category_id,
        )
        .first()
    )

    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category assignment not found.",
        )

    db.delete(link)
    db.commit()

    return {
        "message": "Category unassigned.",
    }


# ============================================================
# ADMIN GET BY ID
# ============================================================


@router.get(
    "/id/{product_id:int}",
    response_model=ProductRead,
)
def product_by_id(
    product_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    return get_product(
        db=db,
        product_id=product_id,
    )


# ============================================================
# PUBLIC PRODUCT DETAILS
# IMPORTANT: KEEP THIS LAST
# ============================================================


@router.get(
    "/{slug}",
    response_model=ProductRead,
)
def product_details(
    slug: str,
    db: Session = Depends(get_db),
):
    return get_product_by_slug(
        db=db,
        slug=slug,
    )