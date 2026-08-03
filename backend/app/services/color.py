from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.color import Color
from app.schemas.color import (
    ColorCreate,
    ColorUpdate,
)


def create_color(
    db: Session,
    data: ColorCreate,
) -> Color:

    existing = (
        db.query(Color)
        .filter(Color.name == data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Color already exists.",
        )

    color = Color(
        name=data.name,
        hex_code=data.hex_code,
    )

    db.add(color)
    db.commit()
    db.refresh(color)

    return color


def get_color(
    db: Session,
    color_id: int,
) -> Color:

    color = db.get(
        Color,
        color_id,
    )

    if not color:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Color not found.",
        )

    return color


def get_colors(
    db: Session,
    skip: int = 0,
    limit: int = 100,
):

    total = db.query(Color).count()

    colors = (
        db.query(Color)
        .order_by(Color.name)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": colors,
    }


def update_color(
    db: Session,
    color_id: int,
    data: ColorUpdate,
) -> Color:

    color = get_color(
        db,
        color_id,
    )

    values = data.model_dump(
        exclude_unset=True,
    )

    if "name" in values:

        existing = (
            db.query(Color)
            .filter(
                Color.name == values["name"],
                Color.id != color.id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Color already exists.",
            )

    for key, value in values.items():
        setattr(
            color,
            key,
            value,
        )

    db.commit()
    db.refresh(color)

    return color


def delete_color(
    db: Session,
    color_id: int,
) -> None:

    color = get_color(
        db,
        color_id,
    )

    db.delete(color)
    db.commit()