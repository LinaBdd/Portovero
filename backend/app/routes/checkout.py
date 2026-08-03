from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.checkout import (
    CheckoutRequest,
)

from app.schemas.order import (
    OrderRead,
)

from app.services.checkout import checkout


router = APIRouter(
    prefix="/checkout",
    tags=["Checkout"],
)


@router.post(
    "/",
    response_model=OrderRead,
)
def create_checkout(
    data: CheckoutRequest,
    db: Session = Depends(get_db),
):
    return checkout(
        db=db,
        data=data,
    )