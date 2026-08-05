from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.product import Product
from app.models.review import Review
from app.models.user import User

from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
)


def get_reviews_by_product(
    db: Session,
    product_id: int,
):
    return (
        db.query(Review)
        .filter(
            Review.product_id == product_id,
            Review.is_visible == True,
        )
        .order_by(
            Review.created_at.desc(),
        )
        .all()
    )


def get_review(
    db: Session,
    review_id: int,
):
    return (
        db.query(Review)
        .filter(
            Review.id == review_id,
        )
        .first()
    )


def create_review(
    db: Session,
    data: ReviewCreate,
):
    user = (
        db.query(User)
        .filter(User.id == data.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    product = (
        db.query(Product)
        .filter(Product.id == data.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found.",
        )

    existing = (
        db.query(Review)
        .filter(
            Review.user_id == data.user_id,
            Review.product_id == data.product_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already reviewed this product.",
        )

    review = Review(
        **data.model_dump(),
    )

    db.add(review)

    db.commit()

    db.refresh(review)

    return review


def update_review(
    db: Session,
    review_id: int,
    data: ReviewUpdate,
):
    review = get_review(
        db,
        review_id,
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found.",
        )

    for key, value in data.model_dump(
        exclude_unset=True,
    ).items():
        setattr(
            review,
            key,
            value,
        )

    db.commit()

    db.refresh(review)

    return review


def delete_review(
    db: Session,
    review_id: int,
):
    review = get_review(
        db,
        review_id,
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found.",
        )

    db.delete(review)

    db.commit()

    return {
        "message": "Review deleted successfully."
    }


def get_average_rating(
    db: Session,
    product_id: int,
):
    average, total = (
        db.query(
            func.avg(
                Review.rating,
            ),
            func.count(
                Review.id,
            ),
        )
        .filter(
            Review.product_id == product_id,
            Review.is_visible == True,
        )
        .first()
    )

    return {
        "average_rating": round(
            float(average or 0),
            2,
        ),
        "total_reviews": total,
    }