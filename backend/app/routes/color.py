from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.color import (
    ColorCreate,
    ColorRead,
    ColorUpdate,
)

from app.services.color import (
    create_color,
    delete_color,
    get_color,
    get_colors,
    update_color,
)

router = APIRouter(
    prefix="/colors",
    tags=["Colors"],
)


@router.post(
    "/create",
    response_model=ColorRead,
)
def create(
    data: ColorCreate,
    db: Session = Depends(get_db),
):
    return create_color(
        db,
        data,
    )


@router.get(
    "/",
)
def list_colors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return get_colors(
        db,
        skip,
        limit,
    )


@router.get(
    "/{color_id}",
    response_model=ColorRead,
)
def retrieve(
    color_id: int,
    db: Session = Depends(get_db),
):
    return get_color(
        db,
        color_id,
    )


@router.put(
    "/{color_id}",
    response_model=ColorRead,
)
def update(
    color_id: int,
    data: ColorUpdate,
    db: Session = Depends(get_db),
):
    return update_color(
        db,
        color_id,
        data,
    )


@router.delete(
    "/{color_id}",
    status_code=204,
)
def delete(
    color_id: int,
    db: Session = Depends(get_db),
):
    delete_color(
        db,
        color_id,
    )