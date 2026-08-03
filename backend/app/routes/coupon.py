from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.coupon import (
    CouponCreate,
    CouponRead,
    CouponUpdate,
)

from app.services.coupon import (
    create_coupon,
    delete_coupon,
    get_coupon,
    get_coupons,
    update_coupon,
)


router = APIRouter(
    prefix="/coupons",
    tags=["Coupons"],
)


@router.post(
    "/create",
    response_model=CouponRead,
)
def create(
    data: CouponCreate,
    db: Session = Depends(get_db),
):
    return create_coupon(
        db,
        data,
    )


@router.get(
    "/",
    response_model=list[CouponRead],
)
def read_all(
    db: Session = Depends(get_db),
):
    return get_coupons(db)


@router.get(
    "/{coupon_id}",
    response_model=CouponRead,
)
def read(
    coupon_id: int,
    db: Session = Depends(get_db),
):
    coupon = get_coupon(
        db,
        coupon_id,
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found.",
        )

    return coupon


@router.put(
    "/{coupon_id}",
    response_model=CouponRead,
)
def update(
    coupon_id: int,
    data: CouponUpdate,
    db: Session = Depends(get_db),
):
    coupon = update_coupon(
        db,
        coupon_id,
        data,
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found.",
        )

    return coupon


@router.delete(
    "/{coupon_id}",
)
def delete(
    coupon_id: int,
    db: Session = Depends(get_db),
):
    coupon = delete_coupon(
        db,
        coupon_id,
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found.",
        )

    return {
        "message": "Coupon deleted successfully.",
    }