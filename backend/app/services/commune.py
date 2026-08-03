from sqlalchemy.orm import Session

from app.models.commune import Commune
from app.models.wilaya import Wilaya
from app.schemas.commune import (
    CommuneCreate,
    CommuneUpdate,
)


def get_communes(db: Session):
    return db.query(Commune).order_by(
        Commune.name
    ).all()


def get_commune(
    db: Session,
    commune_id: int,
):
    return db.query(Commune).filter(
        Commune.id == commune_id
    ).first()


def get_communes_by_wilaya(
    db: Session,
    wilaya_id: int,
):
    return (
        db.query(Commune)
        .filter(
            Commune.wilaya_id == wilaya_id
        )
        .order_by(Commune.name)
        .all()
    )


def create_commune(
    db: Session,
    commune: CommuneCreate,
):
    wilaya = db.query(Wilaya).filter(
        Wilaya.id == commune.wilaya_id
    ).first()

    if not wilaya:
        return None

    db_commune = Commune(
        **commune.model_dump()
    )

    db.add(db_commune)
    db.commit()
    db.refresh(db_commune)

    return db_commune


def update_commune(
    db: Session,
    commune_id: int,
    data: CommuneUpdate,
):
    db_commune = get_commune(
        db,
        commune_id,
    )

    if not db_commune:
        return None

    for key, value in data.model_dump(
        exclude_unset=True
    ).items():
        setattr(db_commune, key, value)

    db.commit()
    db.refresh(db_commune)

    return db_commune


def delete_commune(
    db: Session,
    commune_id: int,
):
    db_commune = get_commune(
        db,
        commune_id,
    )

    if not db_commune:
        return None

    db.delete(db_commune)
    db.commit()

    return db_commune

def get_commune_by_code(
    db: Session,
    code: int,
):
    return db.query(Commune).filter(
        Commune.code == code
    ).first()