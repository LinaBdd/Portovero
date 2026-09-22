from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.session import get_db
from app.schemas.site import (
    ContactMessageCreate,
    ContactMessageRead,
    ContentItemCreate,
    ContentItemRead,
    ContentItemUpdate,
    SettingsUpdate,
)
from app.services import site as service

router = APIRouter(prefix="/site", tags=["Site"])


def _check_type(type_: str | None):
    if type_ is not None and type_ not in service.CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unknown content type.")


# ---------- Public ----------

@router.get("/settings")
def read_settings(db: Session = Depends(get_db)):
    return service.get_settings(db)


@router.get("/content", response_model=list[ContentItemRead])
def read_content(type: str | None = None, db: Session = Depends(get_db)):
    _check_type(type)
    return service.list_content(db, type, only_active=True)


@router.post("/contact", response_model=ContactMessageRead)
def send_contact(data: ContactMessageCreate, db: Session = Depends(get_db)):
    return service.create_message(db, data)


# ---------- Admin ----------

@router.put("/settings", dependencies=[Depends(get_current_admin)])
def write_settings(data: SettingsUpdate, db: Session = Depends(get_db)):
    return service.update_settings(db, data.settings)


@router.get(
    "/content/all",
    response_model=list[ContentItemRead],
    dependencies=[Depends(get_current_admin)],
)
def read_all_content(type: str | None = None, db: Session = Depends(get_db)):
    _check_type(type)
    return service.list_content(db, type, only_active=False)


@router.post(
    "/content",
    response_model=ContentItemRead,
    dependencies=[Depends(get_current_admin)],
)
def create_content(data: ContentItemCreate, db: Session = Depends(get_db)):
    _check_type(data.type)
    return service.create_content(db, data)


@router.put(
    "/content/{item_id}",
    response_model=ContentItemRead,
    dependencies=[Depends(get_current_admin)],
)
def update_content(item_id: int, data: ContentItemUpdate, db: Session = Depends(get_db)):
    item = service.update_content(db, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Content not found.")
    return item


@router.delete("/content/{item_id}", dependencies=[Depends(get_current_admin)])
def delete_content(item_id: int, db: Session = Depends(get_db)):
    if not service.delete_content(db, item_id):
        raise HTTPException(status_code=404, detail="Content not found.")
    return {"message": "Content deleted successfully."}


@router.get(
    "/contact",
    response_model=list[ContactMessageRead],
    dependencies=[Depends(get_current_admin)],
)
def read_messages(db: Session = Depends(get_db)):
    return service.list_messages(db)


@router.put(
    "/contact/{message_id}/read",
    response_model=ContactMessageRead,
    dependencies=[Depends(get_current_admin)],
)
def mark_message(message_id: int, is_read: bool = True, db: Session = Depends(get_db)):
    message = service.set_message_read(db, message_id, is_read)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found.")
    return message


@router.delete("/contact/{message_id}", dependencies=[Depends(get_current_admin)])
def remove_message(message_id: int, db: Session = Depends(get_db)):
    if not service.delete_message(db, message_id):
        raise HTTPException(status_code=404, detail="Message not found.")
    return {"message": "Message deleted successfully."}
