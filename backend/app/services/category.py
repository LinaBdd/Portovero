import re
import unicodedata

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
)


def slugify(value: str) -> str:
    value = str(value)
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value.lower())
    value = re.sub(r"[\s_-]+", "-", value).strip("-")
    return value


def generate_unique_slug(
    db: Session,
    name: str,
) -> str:
    slug = slugify(name)
    original_slug = slug

    counter = 1

    while (
        db.query(Category)
        .filter(Category.slug == slug)
        .first()
    ):
        slug = f"{original_slug}-{counter}"
        counter += 1

    return slug


def create_category(
    db: Session,
    data: CategoryCreate,
) -> Category:

    category = Category(
        name=data.name,
        slug=generate_unique_slug(
            db,
            data.name,
        ),
        description=data.description,
        image=data.image,
        is_active=data.is_active,
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def get_category(
    db: Session,
    category_id: int,
) -> Category:

    category = db.get(
        Category,
        category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return category


def get_category_by_slug(
    db: Session,
    slug: str,
) -> Category:

    category = (
        db.query(Category)
        .filter(
            Category.slug == slug,
            Category.is_active == True,
        )
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return category


def get_categories(
    db: Session,
    skip: int = 0,
    limit: int = 20,
):

    total = (
        db.query(Category)
        .count()
    )

    categories = (
        db.query(Category)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": categories,
    }


def get_active_categories(
    db: Session,
):

    return (
        db.query(Category)
        .filter(
            Category.is_active == True,
        )
        .order_by(Category.name)
        .all()
    )


def update_category(
    db: Session,
    category_id: int,
    data: CategoryUpdate,
) -> Category:

    category = get_category(
        db,
        category_id,
    )

    values = data.model_dump(
        exclude_unset=True,
    )

    if (
        "name" in values
        and values["name"] != category.name
    ):
        values["slug"] = generate_unique_slug(
            db,
            values["name"],
        )

    for key, value in values.items():
        setattr(
            category,
            key,
            value,
        )

    db.commit()
    db.refresh(category)

    return category


def delete_category(
    db: Session,
    category_id: int,
) -> None:

    category = get_category(
        db,
        category_id,
    )

    db.delete(category)
    db.commit()