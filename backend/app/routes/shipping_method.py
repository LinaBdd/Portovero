from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.shipping_method import (
    ShippingMethodCreate,
    ShippingMethodRead,
    ShippingMethodUpdate,
)
from fastapi import File

from app.services.shipping_method import (
    create_shipping_method,
    delete_shipping_method,
    get_shipping_method,
    get_shipping_methods,
    update_shipping_method,
)
from app.services.shipping_rate import import_shipping_rates_csv
from app.models.shipping_rate import ShippingRate

router = APIRouter(
    prefix="/shipping-methods",
    tags=["Shipping Methods"],
)
shipping_rates_router = APIRouter(
    prefix="/shipping-rates",
    tags=["Shipping Rates"],
)

@router.get(
    "/",
    response_model=list[ShippingMethodRead],
)
def read_shipping_methods(
    db: Session = Depends(get_db),
):
    return get_shipping_methods(db)


@router.get(
    "/{shipping_method_id}",
    response_model=ShippingMethodRead,
)
def read_shipping_method(
    shipping_method_id: int,
    db: Session = Depends(get_db),
):
    shipping_method = get_shipping_method(
        db,
        shipping_method_id,
    )

    if not shipping_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping method not found.",
        )

    return shipping_method


@router.post(
    "/create",
    response_model=ShippingMethodRead,
    status_code=status.HTTP_201_CREATED,
)
def create(
    shipping_method: ShippingMethodCreate,
    db: Session = Depends(get_db),
):
    return create_shipping_method(
        db,
        shipping_method,
    )


@router.put(
    "/{shipping_method_id}",
    response_model=ShippingMethodRead,
)
def update(
    shipping_method_id: int,
    data: ShippingMethodUpdate,
    db: Session = Depends(get_db),
):
    shipping_method = update_shipping_method(
        db,
        shipping_method_id,
        data,
    )

    if not shipping_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping method not found.",
        )

    return shipping_method


@router.delete(
    "/{shipping_method_id}",
)
def delete(
    shipping_method_id: int,
    db: Session = Depends(get_db),
):
    shipping_method = delete_shipping_method(
        db,
        shipping_method_id,
    )

    if not shipping_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipping method not found.",
        )

    return {
        "message": "Shipping method deleted successfully."
    }



@shipping_rates_router.post("/import")
async def import_shipping_rates(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are allowed.",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The CSV file is empty.",
        )

    return import_shipping_rates_csv(
        db=db,
        content=content,
    )



@shipping_rates_router.get("/wilaya/{wilaya_id}")
def get_shipping_rates_by_wilaya(
    wilaya_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(ShippingRate)
        .filter(
            ShippingRate.wilaya_id == wilaya_id,
            ShippingRate.is_active == True,
        )
        .all()
    )