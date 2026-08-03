from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.size import Size
from app.schemas.size import (
    SizeCreate,
    SizeUpdate,
)


def create_size(
    db: Session,
    data: SizeCreate,
) -> Size:

    existing = (
        db.query(Size)
        .filter(Size.name == data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Size already exists.",
        )

    size = Size(
        **data.model_dump(),
    )

    db.add(size)
    db.commit()
    db.refresh(size)

    return size


def get_size(
    db: Session,
    size_id: int,
) -> Size:

    size = db.get(
        Size,
        size_id,
    )

    if not size:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Size not found.",
        )

    return size


def get_sizes(
    db: Session,
    skip: int = 0,
    limit: int = 100,
):

    total = db.query(Size).count()

    items = (
        db.query(Size)
        .order_by(Size.display_order)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": items,
    }


def update_size(
    db: Session,
    size_id: int,
    data: SizeUpdate,
) -> Size:

    size = get_size(
        db,
        size_id,
    )

    values = data.model_dump(
        exclude_unset=True,
    )

    if "name" in values:

        existing = (
            db.query(Size)
            .filter(
                Size.name == values["name"],
                Size.id != size.id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Size already exists.",
            )

    for key, value in values.items():
        setattr(
            size,
            key,
            value,
        )

    db.commit()
    db.refresh(size)

    return size


def delete_size(
    db: Session,
    size_id: int,
) -> None:

    size = get_size(
        db,
        size_id,
    )

    db.delete(size)
    db.commit()