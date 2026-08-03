from app.database.session import SessionLocal
from app.models.user import User
from app.auth.hashing import hash_password


def create_admin():
    db = SessionLocal()

    try:
        existing = (
            db.query(User)
            .filter(User.email == "boudaoud.lina05@gmail.com")
            .first()
        )

        if existing:
            existing.is_admin = True
            existing.is_registered = True
            existing.is_active = True

            # Si tu veux également réinitialiser le mot de passe
            existing.password_hash = hash_password("Admin123!")

            db.commit()

            print("✅ Existing user promoted to admin.")
            return

        admin = User(
            first_name="Lina",
            last_name="Boudaoud",
            phone="0540154691",
            email="boudaoud.lina05@gmail.com",
            password_hash=hash_password("Admin123!"),
            is_registered=True,
            is_admin=True,
            is_active=True,
            marketing_consent=False,
        )

        db.add(admin)
        db.commit()

        print("✅ Admin created successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()