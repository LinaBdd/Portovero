from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.material import (
    MaterialCreate,
    MaterialRead,
    MaterialUpdate,
)

from app.services.material import (
    create_material,
    delete_material,
    get_material,
    get_materials,
    update_material,
)

router = APIRouter(
    prefix="/materials",
    tags=["Materials"],
)


@router.post(
    "/create",
    response_model=MaterialRead,
    status_code=201,
)
def create(
    data: MaterialCreate,
    db: Session = Depends(get_db),
):
    return create_material(
        db=db,
        data=data,
    )


@router.get("/")
def get_all(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_materials(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{material_id}",
    response_model=MaterialRead,
)
def by_id(
    material_id: int,
    db: Session = Depends(get_db),
):
    return get_material(
        db=db,
        material_id=material_id,
    )


@router.put(
    "/{material_id}",
    response_model=MaterialRead,
)
def update(
    material_id: int,
    data: MaterialUpdate,
    db: Session = Depends(get_db),
):
    return update_material(
        db=db,
        material_id=material_id,
        data=data,
    )


@router.delete(
    "/{material_id}",
    status_code=204,
)
def delete(
    material_id: int,
    db: Session = Depends(get_db),
):
    delete_material(
        db=db,
        material_id=material_id,
    )