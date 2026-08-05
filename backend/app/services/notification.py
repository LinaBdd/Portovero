from sqlalchemy.orm import Session

from app.models.notification import Notification

from app.schemas.notification import (
    NotificationCreate,
    NotificationUpdate,
)


def get_notifications(db: Session):
    return (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_notification(
    db: Session,
    notification_id: int,
):
    return (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )


def get_user_notifications(
    db: Session,
    user_id: int,
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def create_notification(
    db: Session,
    data: NotificationCreate,
):
    notification = Notification(
        user_id=data.user_id,
        title=data.title,
        message=data.message,
        type=data.type,
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def update_notification(
    db: Session,
    notification_id: int,
    data: NotificationUpdate,
):
    notification = get_notification(
        db,
        notification_id,
    )

    if not notification:
        return None

    for key, value in data.model_dump(
        exclude_unset=True
    ).items():
        setattr(notification, key, value)

    db.commit()
    db.refresh(notification)

    return notification


def mark_as_read(
    db: Session,
    notification_id: int,
):
    notification = get_notification(
        db,
        notification_id,
    )

    if not notification:
        return None

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification


def delete_notification(
    db: Session,
    notification_id: int,
):
    notification = get_notification(
        db,
        notification_id,
    )

    if not notification:
        return None

    db.delete(notification)

    db.commit()

    return notification