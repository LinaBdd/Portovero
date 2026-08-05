from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.review import (
    ProductRating,
    ReviewCreate,
    ReviewRead,
    ReviewUpdate,
)

from app.services.review import (
    create_review,
    delete_review,
    get_average_rating,
    get_review,
    get_reviews_by_product,
    update_review,
)


router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)


@router.post(
    "/",
    response_model=ReviewRead,
)
def create(
    data: ReviewCreate,
    db: Session = Depends(get_db),
):
    return create_review(
        db,
        data,
    )


@router.get(
    "/product/{product_id}",
    response_model=list[ReviewRead],
)
def read_product_reviews(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_reviews_by_product(
        db,
        product_id,
    )


@router.get(
    "/{review_id}",
    response_model=ReviewRead,
)
def read_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    return get_review(
        db,
        review_id,
    )


@router.put(
    "/{review_id}",
    response_model=ReviewRead,
)
def update(
    review_id: int,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
):
    return update_review(
        db,
        review_id,
        data,
    )


@router.delete(
    "/{review_id}",
)
def delete(
    review_id: int,
    db: Session = Depends(get_db),
):
    return delete_review(
        db,
        review_id,
    )


@router.get(
    "/product/{product_id}/average",
    response_model=ProductRating,
)
def average(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_average_rating(
        db,
        product_id,
    )