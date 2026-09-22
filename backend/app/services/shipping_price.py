from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.shipping_rate import ShippingRate


def get_shipping_price(
    db: Session,
    wilaya_id: int,
    shipping,
) -> Decimal:
    """Prix de livraison = tarif (wilaya, méthode) ; à défaut base_price."""
    rate = (
        db.query(ShippingRate)
        .filter(
            ShippingRate.wilaya_id == wilaya_id,
            ShippingRate.shipping_method_id == shipping.id,
            ShippingRate.is_active.is_(True),
        )
        .first()
    )

    if rate is not None:
        return Decimal(str(rate.price))

    if shipping.base_price is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aucun tarif de livraison pour cette wilaya.",
        )

    return Decimal(str(shipping.base_price))
