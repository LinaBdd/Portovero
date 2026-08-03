from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.category import (
    CategoryCreate,
    CategoryRead,
    CategoryUpdate,
)
from app.services.category import (
    create_category,
    delete_category,
    get_active_categories,
    get_categories,
    get_category,
    get_category_by_slug,
    update_category,
)

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.post(
    "/create",
    response_model=CategoryRead,
    status_code=201,
)
def create(
    data: CategoryCreate,
    db: Session = Depends(get_db),
):
    return create_category(
        db=db,
        data=data,
    )


@router.get(
    "/",
)
def get_all(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_categories(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/active",
    response_model=list[CategoryRead],
)
def active(
    db: Session = Depends(get_db),
):
    return get_active_categories(
        db=db,
    )


@router.get(
    "/slug/{slug}",
    response_model=CategoryRead,
)
def by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    return get_category_by_slug(
        db=db,
        slug=slug,
    )


@router.get(
    "/{category_id}",
    response_model=CategoryRead,
)
def by_id(
    category_id: int,
    db: Session = Depends(get_db),
):
    return get_category(
        db=db,
        category_id=category_id,
    )


@router.put(
    "/{category_id}",
    response_model=CategoryRead,
)
def update(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
):
    return update_category(
        db=db,
        category_id=category_id,
        data=data,
    )


@router.delete(
    "/{category_id}",
    status_code=204,
)
def delete(
    category_id: int,
    db: Session = Depends(get_db),
):
    delete_category(
        db=db,
        category_id=category_id,
    )