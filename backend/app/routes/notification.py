from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.notification import (
    NotificationCreate,
    NotificationRead,
    NotificationUpdate,
)

from app.services.notification import (
    create_notification,
    delete_notification,
    get_notification,
    get_notifications,
    get_user_notifications,
    mark_as_read,
    update_notification,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.post(
    "/",
    response_model=NotificationRead,
)
def create(
    data: NotificationCreate,
    db: Session = Depends(get_db),
):
    return create_notification(
        db,
        data,
    )


@router.get(
    "/",
    response_model=list[NotificationRead],
)
def read_all(
    db: Session = Depends(get_db),
):
    return get_notifications(db)


@router.get(
    "/{notification_id}",
    response_model=NotificationRead,
)
def read(
    notification_id: int,
    db: Session = Depends(get_db),
):
    notification = get_notification(
        db,
        notification_id,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    return notification


@router.get(
    "/user/{user_id}",
    response_model=list[NotificationRead],
)
def read_user_notifications(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_user_notifications(
        db,
        user_id,
    )


@router.put(
    "/{notification_id}",
    response_model=NotificationRead,
)
def update(
    notification_id: int,
    data: NotificationUpdate,
    db: Session = Depends(get_db),
):
    notification = update_notification(
        db,
        notification_id,
        data,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    return notification


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationRead,
)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
):
    notification = mark_as_read(
        db,
        notification_id,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    return notification


@router.delete(
    "/{notification_id}",
)
def delete(
    notification_id: int,
    db: Session = Depends(get_db),
):
    notification = delete_notification(
        db,
        notification_id,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    return {
        "message": "Notification deleted successfully."
    }