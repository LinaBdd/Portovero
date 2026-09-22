from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin

from app.database.session import get_db

from app.schemas.newsletter import (
    NewsletterCreate,
    NewsletterRead,
    NewsletterUpdate,
)

from app.services.newsletter import (
    get_newsletters,
    get_newsletter,
    create_newsletter,
    update_newsletter,
    delete_newsletter,
)

router = APIRouter(
    prefix="/newsletter",
    tags=["Newsletter"],
)


@router.post(
    "/",
    response_model=NewsletterRead,
)
def create(
    data: NewsletterCreate,
    db: Session = Depends(get_db),
):
    return create_newsletter(
        db,
        data,
    )


@router.get(
    "/",
    response_model=list[NewsletterRead],
    dependencies=[Depends(get_current_admin)],
)
def read_all(
    db: Session = Depends(get_db),
):
    return get_newsletters(db)


@router.get(
    "/{newsletter_id}",
    response_model=NewsletterRead,
    dependencies=[Depends(get_current_admin)],
)
def read(
    newsletter_id: int,
    db: Session = Depends(get_db),
):
    newsletter = get_newsletter(
        db,
        newsletter_id,
    )

    if not newsletter:
        raise HTTPException(
            status_code=404,
            detail="Newsletter not found.",
        )

    return newsletter


@router.put(
    "/{newsletter_id}",
    response_model=NewsletterRead,
    dependencies=[Depends(get_current_admin)],
)
def update(
    newsletter_id: int,
    data: NewsletterUpdate,
    db: Session = Depends(get_db),
):
    newsletter = update_newsletter(
        db,
        newsletter_id,
        data,
    )

    if not newsletter:
        raise HTTPException(
            status_code=404,
            detail="Newsletter not found.",
        )

    return newsletter


@router.delete(
    "/{newsletter_id}",
    dependencies=[Depends(get_current_admin)],
)
def delete(
    newsletter_id: int,
    db: Session = Depends(get_db),
):
    newsletter = delete_newsletter(
        db,
        newsletter_id,
    )

    if not newsletter:
        raise HTTPException(
            status_code=404,
            detail="Newsletter not found.",
        )

    return {
        "message": "Newsletter deleted successfully."
    }