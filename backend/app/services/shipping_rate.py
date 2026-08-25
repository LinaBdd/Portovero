import csv
from decimal import Decimal, InvalidOperation
from io import StringIO

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.shipping_method import ShippingMethod
from app.models.shipping_rate import ShippingRate
from app.models.wilaya import Wilaya


REQUIRED_COLUMNS = {
    "wilaya_code",
    "shipping_method",
    "price",
    "is_active",
}

TRUE_VALUES = {
    "true",
    "1",
    "yes",
    "oui",
}

FALSE_VALUES = {
    "false",
    "0",
    "no",
    "non",
}


def _parse_boolean(value: str) -> bool:
    normalized_value = value.strip().lower()

    if normalized_value in TRUE_VALUES:
        return True

    if normalized_value in FALSE_VALUES:
        return False

    raise ValueError(
        "is_active must be true or false"
    )


def import_shipping_rates_csv(
    db: Session,
    content: bytes,
) -> dict:
    """
    Importe les tarifs de livraison par wilaya.

    Si une seule ligne est invalide, aucun tarif n'est enregistré.
    Un tarif existant est mis à jour.
    """

    try:
        csv_text = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The CSV file must be UTF-8 encoded.",
        ) from exc

    reader = csv.DictReader(
        StringIO(csv_text)
    )

    csv_columns = set(reader.fieldnames or [])
    missing_columns = (
        REQUIRED_COLUMNS - csv_columns
    )

    if missing_columns:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Missing CSV columns.",
                "columns": sorted(missing_columns),
            },
        )

    rows_to_import = []
    errors = []
    seen_pairs = set()

    for line_number, row in enumerate(
        reader,
        start=2,
    ):
        try:
            wilaya_code = int(
                (row.get("wilaya_code") or "").strip()
            )

            shipping_method_name = (
                row.get("shipping_method") or ""
            ).strip()

            if not shipping_method_name:
                raise ValueError(
                    "shipping_method is required"
                )

            price = Decimal(
                (row.get("price") or "").strip()
            )

            if price < 0:
                raise ValueError(
                    "price must be greater than or equal to 0"
                )

            is_active = _parse_boolean(
                row.get("is_active") or ""
            )

            unique_pair = (
                wilaya_code,
                shipping_method_name.casefold(),
            )

            if unique_pair in seen_pairs:
                raise ValueError(
                    "duplicate wilaya_code and shipping_method pair"
                )

            seen_pairs.add(unique_pair)

            wilaya = (
                db.query(Wilaya)
                .filter(Wilaya.code == wilaya_code)
                .first()
            )

            if wilaya is None:
                raise ValueError(
                    f"wilaya code {wilaya_code} does not exist"
                )

            shipping_method = (
                db.query(ShippingMethod)
                .filter(
                    ShippingMethod.name.ilike(
                        shipping_method_name
                    )
                )
                .first()
            )

            if shipping_method is None:
                raise ValueError(
                    f"shipping method "
                    f"'{shipping_method_name}' does not exist"
                )

            rows_to_import.append(
                {
                    "wilaya_id": wilaya.id,
                    "shipping_method_id": (
                        shipping_method.id
                    ),
                    "price": price.quantize(
                        Decimal("0.01")
                    ),
                    "is_active": is_active,
                }
            )

        except (
            ValueError,
            InvalidOperation,
        ) as exc:
            errors.append(
                {
                    "line": line_number,
                    "message": str(exc),
                }
            )

    if errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Import cancelled.",
                "errors": errors,
            },
        )

    created = 0
    updated = 0

    try:
        for data in rows_to_import:
            shipping_rate = (
                db.query(ShippingRate)
                .filter(
                    ShippingRate.wilaya_id
                    == data["wilaya_id"],
                    ShippingRate.shipping_method_id
                    == data["shipping_method_id"],
                )
                .first()
            )

            if shipping_rate is None:
                db.add(
                    ShippingRate(**data)
                )
                created += 1

            else:
                shipping_rate.price = data["price"]
                shipping_rate.is_active = (
                    data["is_active"]
                )
                updated += 1

        db.commit()

    except Exception:
        db.rollback()
        raise

    return {
        "created": created,
        "updated": updated,
        "total": len(rows_to_import),
    }