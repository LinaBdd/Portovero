from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.wilaya import (
    WilayaCreate,
    WilayaRead,
    WilayaUpdate,
)
from app.services.wilaya import (
    create_wilaya,
    delete_wilaya,
    get_wilaya,
    get_wilayas,
    update_wilaya,
    get_wilaya_by_code,
)

router = APIRouter(
    prefix="/wilayas",
    tags=["Wilayas"],
)


@router.get(
    "/",
    response_model=list[WilayaRead],
)
def read_wilayas(
    db: Session = Depends(get_db),
):
    return get_wilayas(db)


@router.get(
    "/{wilaya_id}",
    response_model=WilayaRead,
)
def read_wilaya(
    wilaya_id: int,
    db: Session = Depends(get_db),
):
    wilaya = get_wilaya(db, wilaya_id)

    if not wilaya:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wilaya not found.",
        )

    return wilaya


@router.post(
    "/create",
    response_model=WilayaRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    wilaya: WilayaCreate,
    db: Session = Depends(get_db),
):
    return create_wilaya(db, wilaya)


@router.put(
    "/{wilaya_id}",
    response_model=WilayaRead,
)
def update(
    wilaya_id: int,
    data: WilayaUpdate,
    db: Session = Depends(get_db),
):
    wilaya = update_wilaya(
        db,
        wilaya_id,
        data,
    )

    if not wilaya:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wilaya not found.",
        )

    return wilaya


@router.delete(
    "/{wilaya_id}",
)
def delete(
    wilaya_id: int,
    db: Session = Depends(get_db),
):
    wilaya = delete_wilaya(
        db,
        wilaya_id,
    )

    if not wilaya:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wilaya not found.",
        )

    return {
        "message": "Wilaya deleted successfully."
    }


