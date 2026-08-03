import csv
from pathlib import Path

from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.wilaya import Wilaya
from app.models.commune import Commune

BASE_DIR = Path(__file__).resolve().parents[1]  # app/
DATA_DIR = BASE_DIR / "data"

WILAYAS_FILE = DATA_DIR / "wilayas.csv"
COMMUNES_FILE = DATA_DIR / "communes.csv"


def seed_wilayas(db: Session):
    with open(WILAYAS_FILE, encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)

        for row in reader:

            exists = (
                db.query(Wilaya)
                .filter(
                    Wilaya.code == int(row["code_wilaya"])
                )
                .first()
            )

            if exists:
                continue

            db.add(
                Wilaya(
                    code=int(row["code_wilaya"]),
                    name=row["nom_wilaya"],
                    name_ar=row["nom_wilaya_ar"],
                    home_shipping_price=0,
                    stopdesk_shipping_price=0,
                    is_active=True,
                )
            )

        db.commit()

    print("✅ Wilayas imported successfully.")        


def seed_communes(db: Session):
    with open(COMMUNES_FILE, encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)

        for row in reader:

            wilaya = (
                db.query(Wilaya)
                .filter(
                    Wilaya.code == int(row["code_wilaya"])
                )
                .first()
            )

            if wilaya is None:
                print(
                    f"Wilaya introuvable : {row['code_wilaya']}"
                )
                continue

            exists = (
                db.query(Commune)
                .filter(
                    Commune.code == int(row["code_commune"])
                )
                .first()
            )

            if exists:
                continue

            db.add(
                Commune(
                    code=int(row["code_commune"]),
                    name=row["nom_commune"],
                    name_ar=row["nom_commune_ar"],
                    daira=row["daira"],
                    daira_ar=row["daira_ar"],
                    wilaya_id=wilaya.id,
                )
            )

    db.commit()

    print("✅ Communes imported successfully.")

if __name__ == "__main__":
    db = SessionLocal()

    try:
        seed_wilayas(db)
        seed_communes(db)
        
    finally:
        db.close()