from sqlalchemy.orm import Session

from app.models.contact_message import ContactMessage
from app.models.content_item import ContentItem
from app.models.site_setting import SiteSetting
from app.schemas.site import (
    ContactMessageCreate,
    ContentItemCreate,
    ContentItemUpdate,
)

CONTENT_TYPES = {"faq", "testimonial", "feature", "value", "instagram"}

# Valeurs initiales : utilisées tant que l'admin n'a pas modifié la clé.
DEFAULT_SETTINGS: dict[str, str] = {
    "brand_name": "Portovero",
    "site_description": "Timeless pieces for everyday elegance.",
    "contact_email": "",
    "contact_phone": "",
    "contact_address": "",
    "instagram_url": "",
    "facebook_url": "",
    "tiktok_url": "",
    "footer_copyright": "© {year} Portovero. All rights reserved.",
    "hero_eyebrow": "",
    "hero_title": "Timeless pieces\nfor everyday\nelegance.",
    "hero_subtitle": "Discover our curated collection of exceptional pieces, crafted with uncompromising attention to detail.",
    "hero_cta_label": "Explore collection",
    "hero_cta_link": "/shop",
    "hero_cta2_label": "Our story",
    "hero_cta2_link": "/about",
    "hero_caption": "",
    "best_sellers_title": "Best Sellers",
    "best_sellers_subtitle": "",
    "why_eyebrow": "",
    "why_title": "Why Portovero",
    "why_subtitle": "",
    "testimonials_title": "Loved by Our Customers",
    "testimonials_subtitle": "",
    "story_eyebrow": "Our Story",
    "story_title": "",
    "story_text": "",
    "story_cta_label": "Discover Our Story",
    "story_image": "",
    "about_eyebrow": "Our story",
    "about_title": "",
    "about_text": "",
    "about_image": "",
    "about_image_alt": "",
    "about_cta_label": "Discover the collection",
    "newsletter_title": "Join the Portovero Club",
    "newsletter_text": "",
    "instagram_title": "Instagram",
    "faq_title": "Frequently Asked Questions",
    "contact_title": "Get in touch",
    "contact_subtitle": "",
    "contact_success": "Message sent. We will reply as soon as possible.",
    "shipping_info": "",
    "returns_info": "",
}


def get_settings(db: Session) -> dict[str, str]:
    values = dict(DEFAULT_SETTINGS)
    for row in db.query(SiteSetting).all():
        values[row.key] = row.value
    return values


def update_settings(db: Session, data: dict[str, str]) -> dict[str, str]:
    for key, value in data.items():
        if key not in DEFAULT_SETTINGS:
            continue
        row = db.get(SiteSetting, key)
        if row:
            row.value = value
        else:
            db.add(SiteSetting(key=key, value=value))
    db.commit()
    return get_settings(db)


def list_content(db: Session, type_: str | None, only_active: bool):
    query = db.query(ContentItem)
    if type_:
        query = query.filter(ContentItem.type == type_)
    if only_active:
        query = query.filter(ContentItem.is_active.is_(True))
    return query.order_by(ContentItem.position.asc(), ContentItem.id.asc()).all()


def create_content(db: Session, data: ContentItemCreate):
    item = ContentItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_content(db: Session, item_id: int, data: ContentItemUpdate):
    item = db.get(ContentItem, item_id)
    if not item:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def delete_content(db: Session, item_id: int):
    item = db.get(ContentItem, item_id)
    if not item:
        return None
    db.delete(item)
    db.commit()
    return item


def create_message(db: Session, data: ContactMessageCreate):
    message = ContactMessage(**data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def list_messages(db: Session):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


def set_message_read(db: Session, message_id: int, is_read: bool):
    message = db.get(ContactMessage, message_id)
    if not message:
        return None
    message.is_read = is_read
    db.commit()
    db.refresh(message)
    return message


def delete_message(db: Session, message_id: int):
    message = db.get(ContactMessage, message_id)
    if not message:
        return None
    db.delete(message)
    db.commit()
    return message
