from fastapi import (
    APIRouter,
    Depends,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.size import (
    SizeCreate,
    SizeList,
    SizeRead,
    SizeUpdate,
)

from app.services.size import (
    create_size,
    delete_size,
    get_size,
    get_sizes,
    update_size,
)

router = APIRouter(
    prefix="/sizes",
    tags=["Sizes"],
)


@router.post(
    "/create",
    response_model=SizeRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: SizeCreate,
    db: Session = Depends(get_db),
):
    return create_size(
        db,
        data,
    )


@router.get(
    "/",
    response_model=SizeList,
)
def list_sizes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return get_sizes(
        db,
        skip,
        limit,
    )


@router.get(
    "/{size_id}",
    response_model=SizeRead,
)
def retrieve(
    size_id: int,
    db: Session = Depends(get_db),
):
    return get_size(
        db,
        size_id,
    )


@router.put(
    "/{size_id}",
    response_model=SizeRead,
)
def update(
    size_id: int,
    data: SizeUpdate,
    db: Session = Depends(get_db),
):
    return update_size(
        db,
        size_id,
        data,
    )


@router.delete(
    "/{size_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    size_id: int,
    db: Session = Depends(get_db),
):
    delete_size(
        db,
        size_id,
    )