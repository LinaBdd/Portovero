from sqlalchemy.orm import Session

from app.models.newsletter import Newsletter

from app.schemas.newsletter import (
    NewsletterCreate,
    NewsletterUpdate,
)


def get_newsletters(db: Session):
    return (
        db.query(Newsletter)
        .order_by(Newsletter.created_at.desc())
        .all()
    )


def get_newsletter(
    db: Session,
    newsletter_id: int,
):
    return (
        db.query(Newsletter)
        .filter(
            Newsletter.id == newsletter_id
        )
        .first()
    )


def create_newsletter(
    db: Session,
    data: NewsletterCreate,
):
    newsletter = Newsletter(
        email=data.email,
        phone=data.phone,
    )

    db.add(newsletter)
    db.commit()
    db.refresh(newsletter)

    return newsletter


def update_newsletter(
    db: Session,
    newsletter_id: int,
    data: NewsletterUpdate,
):
    newsletter = get_newsletter(
        db,
        newsletter_id,
    )

    if not newsletter:
        return None

    newsletter.subscribed = data.subscribed

    db.commit()
    db.refresh(newsletter)

    return newsletter


def delete_newsletter(
    db: Session,
    newsletter_id: int,
):
    newsletter = get_newsletter(
        db,
        newsletter_id,
    )

    if not newsletter:
        return None

    db.delete(newsletter)
    db.commit()

    return newsletter