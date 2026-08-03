from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.commune import (
    CommuneCreate,
    CommuneRead,
    CommuneUpdate,
)
from app.services.commune import (
    create_commune,
    delete_commune,
    get_commune,
    get_communes,
    get_communes_by_wilaya,
    update_commune,
)

router = APIRouter(
    prefix="/communes",
    tags=["Communes"],
)


@router.get(
    "/",
    response_model=list[CommuneRead],
)
def read_communes(
    db: Session = Depends(get_db),
):
    return get_communes(db)


@router.get(
    "/wilaya/{wilaya_id}",
    response_model=list[CommuneRead],
)
def read_communes_by_wilaya(
    wilaya_id: int,
    db: Session = Depends(get_db),
):
    return get_communes_by_wilaya(
        db,
        wilaya_id,
    )


@router.get(
    "/{commune_id}",
    response_model=CommuneRead,
)
def read_commune(
    commune_id: int,
    db: Session = Depends(get_db),
):
    commune = get_commune(
        db,
        commune_id,
    )

    if not commune:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commune not found.",
        )

    return commune


@router.post(
    "/create",
    response_model=CommuneRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    commune: CommuneCreate,
    db: Session = Depends(get_db),
):
    db_commune = create_commune(
        db,
        commune,
    )

    if not db_commune:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wilaya not found.",
        )

    return db_commune


@router.put(
    "/{commune_id}",
    response_model=CommuneRead,
)
def update(
    commune_id: int,
    data: CommuneUpdate,
    db: Session = Depends(get_db),
):
    commune = update_commune(
        db,
        commune_id,
        data,
    )

    if not commune:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commune not found.",
        )

    return commune


@router.delete(
    "/{commune_id}",
)
def delete(
    commune_id: int,
    db: Session = Depends(get_db),
):
    commune = delete_commune(
        db,
        commune_id,
    )

    if not commune:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commune not found.",
        )

    return {
        "message": "Commune deleted successfully."
    }