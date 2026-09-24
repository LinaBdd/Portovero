from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.shipping_rate import ShippingRate
from app.models.wilaya import Wilaya


STOPDESK_KEYWORDS = ("stopdesk", "stop desk", "point relais", "desk")


def _is_stopdesk(shipping_method) -> bool:
    """Devine le type de livraison à partir du nom de la méthode.
    Domicile par défaut, tant qu'aucun champ dédié n'existe en base."""
    name = (shipping_method.name or "").lower()
    return any(keyword in name for keyword in STOPDESK_KEYWORDS)


def get_shipping_price(
    db: Session,
    wilaya_id: int,
    shipping,
) -> Decimal:
    """Prix de livraison, dans cet ordre de priorité :
    1. Tarif précis (wilaya, méthode) dans shipping_rates, si présent.
    2. Tarif propre à la wilaya (home_shipping_price / stopdesk_shipping_price),
       s'il est renseigné (> 0).
    3. Prix de base de la méthode, en dernier recours.
    """

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

    wilaya = db.query(Wilaya).filter(Wilaya.id == wilaya_id).first()

    if wilaya is not None:
        wilaya_price = (
            wilaya.stopdesk_shipping_price
            if _is_stopdesk(shipping)
            else wilaya.home_shipping_price
        )

        if wilaya_price and Decimal(str(wilaya_price)) > 0:
            return Decimal(str(wilaya_price))

    if shipping.base_price is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aucun tarif de livraison pour cette wilaya.",
        )

    return Decimal(str(shipping.base_price))