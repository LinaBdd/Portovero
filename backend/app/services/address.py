from sqlalchemy.orm import Session

from app.models.address import Address
from app.models.user import User
from app.models.wilaya import Wilaya
from app.models.commune import Commune

from app.schemas.address import (
    AddressCreate,
    AddressUpdate,
)


def get_addresses(db: Session):
    return db.query(Address).all()


def get_address(
    db: Session,
    address_id: int,
):
    return (
        db.query(Address)
        .filter(Address.id == address_id)
        .first()
    )


def get_addresses_by_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(Address)
        .filter(Address.user_id == user_id)
        .all()
    )


def create_address(
    db: Session,
    user_id: int,
    address: AddressCreate,
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        return None

    wilaya = db.query(Wilaya).filter(
        Wilaya.id == address.wilaya_id
    ).first()

    if not wilaya:
        return None

    commune = db.query(Commune).filter(
        Commune.id == address.commune_id
    ).first()

    if not commune:
        return None

    if commune.wilaya_id != address.wilaya_id:
        return None

    if address.is_default:
        (
            db.query(Address)
            .filter(Address.user_id == user_id)
            .update({"is_default": False})
        )

    db_address = Address(
        user_id=user_id,
        **address.model_dump(),
    )

    db.add(db_address)
    db.commit()
    db.refresh(db_address)

    return db_address


def update_address(
    db: Session,
    address_id: int,
    data: AddressUpdate,
):
    db_address = get_address(
        db,
        address_id,
    )

    if not db_address:
        return None

    values = data.model_dump(
        exclude_unset=True,
    )

    if "wilaya_id" in values or "commune_id" in values:

        wilaya_id = values.get(
            "wilaya_id",
            db_address.wilaya_id,
        )

        commune_id = values.get(
            "commune_id",
            db_address.commune_id,
        )

        commune = (
            db.query(Commune)
            .filter(
                Commune.id == commune_id
            )
            .first()
        )

        if not commune:
            return None

        if commune.wilaya_id != wilaya_id:
            return None

    if values.get("is_default"):

        (
            db.query(Address)
            .filter(
                Address.user_id == db_address.user_id
            )
            .update({"is_default": False})
        )

    for key, value in values.items():
        setattr(db_address, key, value)

    db.commit()
    db.refresh(db_address)

    return db_address


def delete_address(
    db: Session,
    address_id: int,
):
    db_address = get_address(
        db,
        address_id,
    )

    if not db_address:
        return None

    db.delete(db_address)
    db.commit()

    return db_address