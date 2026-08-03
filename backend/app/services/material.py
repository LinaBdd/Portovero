from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.material import Material
from app.schemas.material import (
    MaterialCreate,
    MaterialUpdate,
)


def create_material(
    db: Session,
    data: MaterialCreate,
) -> Material:

    existing = (
        db.query(Material)
        .filter(Material.name == data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Material already exists.",
        )

    material = Material(
        name=data.name,
    )

    db.add(material)
    db.commit()
    db.refresh(material)

    return material


def get_material(
    db: Session,
    material_id: int,
) -> Material:

    material = db.get(
        Material,
        material_id,
    )

    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found.",
        )

    return material


def get_materials(
    db: Session,
    skip: int = 0,
    limit: int = 20,
):

    total = (
        db.query(Material)
        .count()
    )

    materials = (
        db.query(Material)
        .order_by(Material.name)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": materials,
    }


def update_material(
    db: Session,
    material_id: int,
    data: MaterialUpdate,
) -> Material:

    material = get_material(
        db,
        material_id,
    )

    values = data.model_dump(
        exclude_unset=True,
    )

    if (
        "name" in values
        and values["name"] != material.name
    ):
        existing = (
            db.query(Material)
            .filter(Material.name == values["name"])
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Material already exists.",
            )

    for key, value in values.items():
        setattr(
            material,
            key,
            value,
        )

    db.commit()
    db.refresh(material)

    return material


def delete_material(
    db: Session,
    material_id: int,
) -> None:

    material = get_material(
        db,
        material_id,
    )

    db.delete(material)
    db.commit()