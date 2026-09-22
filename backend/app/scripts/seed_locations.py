import csv
from pathlib import Path
from typing import Optional

from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.wilaya import Wilaya
from app.models.commune import Commune

BASE_DIR = Path(__file__).resolve().parents[1]  # app/
DATA_DIR = BASE_DIR / "data"

def seed_wilayas(db: Session, file_path: Optional[Path] = None):
    """Importe les wilayas depuis un fichier CSV"""
    
    # Utiliser le fichier par défaut ou celui passé en paramètre
    if file_path is None:
        file_path = DATA_DIR / "wilayas.csv"
    
    with open(file_path, encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)

        for row in reader:
            exists = (
                db.query(Wilaya)
                .filter(Wilaya.code == int(row["code_wilaya"]))
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

    print(f"✅ Wilayas imported successfully from {file_path}")

def seed_communes(db: Session, file_path: Optional[Path] = None):
    """Importe les communes depuis un fichier CSV"""
    
    # Utiliser le fichier par défaut ou celui passé en paramètre
    if file_path is None:
        file_path = DATA_DIR / "communes.csv"
    
    with open(file_path, encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)

        for row in reader:
            wilaya = (
                db.query(Wilaya)
                .filter(Wilaya.code == int(row["code_wilaya"]))
                .first()
            )

            if wilaya is None:
                print(f"Wilaya introuvable : {row['code_wilaya']}")
                continue

            exists = (
                db.query(Commune)
                .filter(Commune.code == int(row["code_commune"]))
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

    print(f"✅ Communes imported successfully from {file_path}")

if __name__ == "__main__":
    db = SessionLocal()

    try:
        # Exemple d'utilisation avec des fichiers personnalisés
        mon_fichier_wilayas = Path("/chemin/vers/mon/wilayas.csv")
        mon_fichier_communes = Path("/chemin/vers/mon/communes.csv")
        
        seed_wilayas(db, mon_fichier_wilayas)
        seed_communes(db, mon_fichier_communes)
        
        # Ou utiliser les fichiers par défaut
        # seed_wilayas(db)
        # seed_communes(db)
        
    finally:
        db.close()