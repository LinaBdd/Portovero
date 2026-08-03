from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.coupon import Coupon
from app.schemas.coupon import (
    CouponCreate,
    CouponUpdate,
)


def get_coupons(db: Session):
    return db.query(Coupon).all()


def get_coupon(
    db: Session,
    coupon_id: int,
):
    return (
        db.query(Coupon)
        .filter(Coupon.id == coupon_id)
        .first()
    )


def get_coupon_by_code(
    db: Session,
    code: str,
):
    return (
        db.query(Coupon)
        .filter(Coupon.code == code.upper())
        .first()
    )


def create_coupon(
    db: Session,
    data: CouponCreate,
):
    if get_coupon_by_code(
        db,
        data.code,
    ):
        raise HTTPException(
            status_code=400,
            detail="Coupon already exists.",
        )

    coupon = Coupon(
        name=data.name,
        code=data.code.upper(),
        description=data.description,
        discount_type=data.discount_type,
        discount_value=data.discount_value,
        minimum_amount=data.minimum_amount,
        maximum_discount=data.maximum_discount,
        usage_limit=data.usage_limit,
        usage_per_user=data.usage_per_user,
        starts_at=data.starts_at,
        expires_at=data.expires_at,
        is_active=data.is_active,
    )

    db.add(coupon)

    db.commit()

    db.refresh(coupon)

    return coupon


def update_coupon(
    db: Session,
    coupon_id: int,
    data: CouponUpdate,
):
    coupon = get_coupon(
        db,
        coupon_id,
    )

    if not coupon:
        return None

    for key, value in data.model_dump(
        exclude_unset=True,
    ).items():
        setattr(
            coupon,
            key,
            value,
        )

    db.commit()

    db.refresh(coupon)

    return coupon


def delete_coupon(
    db: Session,
    coupon_id: int,
):
    coupon = get_coupon(
        db,
        coupon_id,
    )

    if not coupon:
        return None

    db.delete(coupon)

    db.commit()

    return coupon


def validate_coupon(
    db: Session,
    code: str,
):
    coupon = get_coupon_by_code(
        db,
        code,
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found.",
        )

    now = datetime.now(
        timezone.utc,
    )

    if not coupon.is_active:
        raise HTTPException(
            status_code=400,
            detail="Coupon inactive.",
        )

    if coupon.starts_at > now:
        raise HTTPException(
            status_code=400,
            detail="Coupon not started.",
        )

    if (
        coupon.expires_at
        and coupon.expires_at < now
    ):
        raise HTTPException(
            status_code=400,
            detail="Coupon expired.",
        )

    if (
        coupon.usage_limit
        and coupon.used_count >= coupon.usage_limit
    ):
        raise HTTPException(
            status_code=400,
            detail="Coupon exhausted.",
        )

    return coupon