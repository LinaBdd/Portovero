from sqlalchemy.orm import Session

from app.models.banner import Banner

from app.schemas.banner import (
    BannerCreate,
    BannerUpdate,
)


def get_banners(db: Session):
    return (
        db.query(Banner)
        .order_by(Banner.position.asc())
        .all()
    )


def get_active_banners(db: Session):
    return (
        db.query(Banner)
        .filter(Banner.is_active == True)
        .order_by(Banner.position.asc())
        .all()
    )


def get_banner(
    db: Session,
    banner_id: int,
):
    return (
        db.query(Banner)
        .filter(Banner.id == banner_id)
        .first()
    )


def create_banner(
    db: Session,
    data: BannerCreate,
):
    banner = Banner(
        **data.model_dump()
    )

    db.add(banner)
    db.commit()
    db.refresh(banner)

    return banner


def update_banner(
    db: Session,
    banner_id: int,
    data: BannerUpdate,
):
    banner = get_banner(
        db,
        banner_id,
    )

    if not banner:
        return None

    for key, value in data.model_dump(
        exclude_unset=True
    ).items():
        setattr(
            banner,
            key,
            value,
        )

    db.commit()
    db.refresh(banner)

    return banner


def delete_banner(
    db: Session,
    banner_id: int,
):
    banner = get_banner(
        db,
        banner_id,
    )

    if not banner:
        return None

    db.delete(banner)
    db.commit()

    return banner