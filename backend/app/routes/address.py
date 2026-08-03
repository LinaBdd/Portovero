from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.address import (
    AddressCreate,
    AddressRead,
    AddressUpdate,
)

from app.services.address import (
    get_addresses,
    get_address,
    get_addresses_by_user,
    create_address,
    update_address,
    delete_address,
)

router = APIRouter(
    prefix="/addresses",
    tags=["Addresses"],
)


@router.get(
    "/",
    response_model=list[AddressRead],
)
def read_addresses(
    db: Session = Depends(get_db),
):
    return get_addresses(db)


@router.get(
    "/{address_id}",
    response_model=AddressRead,
)
def read_address(
    address_id: int,
    db: Session = Depends(get_db),
):
    address = get_address(
        db,
        address_id,
    )

    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found.",
        )

    return address


@router.get(
    "/user/{user_id}",
    response_model=list[AddressRead],
)
def read_user_addresses(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_addresses_by_user(
        db,
        user_id,
    )


@router.post(
    "/user/{user_id}",
    response_model=AddressRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    user_id: int,
    address: AddressCreate,
    db: Session = Depends(get_db),
):
    new_address = create_address(
        db,
        user_id,
        address,
    )

    if not new_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user, wilaya or commune.",
        )

    return new_address


@router.put(
    "/{address_id}",
    response_model=AddressRead,
)
def update(
    address_id: int,
    data: AddressUpdate,
    db: Session = Depends(get_db),
):
    address = update_address(
        db,
        address_id,
        data,
    )

    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found or invalid commune.",
        )

    return address


@router.delete(
    "/{address_id}",
)
def delete(
    address_id: int,
    db: Session = Depends(get_db),
):
    address = delete_address(
        db,
        address_id,
    )

    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found.",
        )

    return {
        "message": "Address deleted successfully."
    }