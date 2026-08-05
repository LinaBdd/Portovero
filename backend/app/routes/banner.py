from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.banner import (
    BannerCreate,
    BannerRead,
    BannerUpdate,
)

from app.services.banner import (
    create_banner,
    delete_banner,
    get_active_banners,
    get_banner,
    get_banners,
    update_banner,
)

router = APIRouter(
    prefix="/banners",
    tags=["Banners"],
)


@router.post(
    "/create",
    response_model=BannerRead,
)
def create(
    data: BannerCreate,
    db: Session = Depends(get_db),
):
    return create_banner(
        db,
        data,
    )


@router.get(
    "/",
    response_model=list[BannerRead],
)
def read_all(
    db: Session = Depends(get_db),
):
    return get_banners(db)


@router.get(
    "/active",
    response_model=list[BannerRead],
)
def read_active(
    db: Session = Depends(get_db),
):
    return get_active_banners(db)


@router.get(
    "/{banner_id}",
    response_model=BannerRead,
)
def read(
    banner_id: int,
    db: Session = Depends(get_db),
):
    banner = get_banner(
        db,
        banner_id,
    )

    if not banner:
        raise HTTPException(
            status_code=404,
            detail="Banner not found.",
        )

    return banner


@router.put(
    "/{banner_id}",
    response_model=BannerRead,
)
def update(
    banner_id: int,
    data: BannerUpdate,
    db: Session = Depends(get_db),
):
    banner = update_banner(
        db,
        banner_id,
        data,
    )

    if not banner:
        raise HTTPException(
            status_code=404,
            detail="Banner not found.",
        )

    return banner


@router.delete(
    "/{banner_id}",
)
def delete(
    banner_id: int,
    db: Session = Depends(get_db),
):
    banner = delete_banner(
        db,
        banner_id,
    )

    if not banner:
        raise HTTPException(
            status_code=404,
            detail="Banner not found.",
        )

    return {
        "message": "Banner deleted successfully."
    }