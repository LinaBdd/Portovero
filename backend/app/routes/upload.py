import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.auth.dependencies import get_current_admin


router = APIRouter(prefix="/admin", tags=["Admin"])

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
}

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}

UPLOAD_DIR = Path("uploads/images/products")


@router.post("/upload/image")
async def upload_product_image(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_admin),
):
    """Upload une image produit et retourne son chemin relatif."""

    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.",
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Type de fichier invalide.",
        )

    content = await file.read()

    max_size = 5 * 1024 * 1024

    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="L'image ne doit pas dépasser 5 MB.",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOAD_DIR / filename

    destination.write_bytes(content)

    return {
        "url": f"/uploads/images/products/{filename}",
        "filename": filename,
    }