from sqlalchemy.orm import Session

from app.models.wilaya import Wilaya
from app.schemas.wilaya import (
    WilayaCreate,
    WilayaUpdate,
)


def get_wilayas(db: Session):
    return db.query(Wilaya).order_by(Wilaya.code).all()


def get_wilaya(db: Session, wilaya_id: int):
    return db.query(Wilaya).filter(
        Wilaya.id == wilaya_id
    ).first()


def create_wilaya(
    db: Session,
    wilaya: WilayaCreate,
):
    db_wilaya = Wilaya(**wilaya.model_dump())

    db.add(db_wilaya)
    db.commit()
    db.refresh(db_wilaya)

    return db_wilaya


def update_wilaya(
    db: Session,
    wilaya_id: int,
    data: WilayaUpdate,
):
    db_wilaya = get_wilaya(db, wilaya_id)

    if not db_wilaya:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_wilaya, key, value)

    db.commit()
    db.refresh(db_wilaya)

    return db_wilaya


def delete_wilaya(
    db: Session,
    wilaya_id: int,
):
    db_wilaya = get_wilaya(db, wilaya_id)

    if not db_wilaya:
        return None

    db.delete(db_wilaya)
    db.commit()

    return db_wilaya


def get_wilaya_by_code(
    db: Session,
    code: int,
):
    return db.query(Wilaya).filter(
        Wilaya.code == code
    ).first()