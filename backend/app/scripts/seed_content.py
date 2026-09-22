"""Initialise le contenu éditable du site avec les textes historiques.

Idempotent : ne touche pas aux paramètres déjà enregistrés et ne recrée pas
un type de contenu qui possède déjà des éléments.
Usage : python -m app.scripts.seed_content
"""

from app.database.session import SessionLocal
from app.models.content_item import ContentItem
from app.models.site_setting import SiteSetting

SETTINGS = {
    "contact_email": "support@portovero.com",
    "contact_phone": "+213 5 40 15 46 91",
    "contact_address": "Alger, Algérie",
    "hero_eyebrow": "Autumn / Winter 2024",
    "hero_caption": "The season in four fabrics.",
    "best_sellers_subtitle": "Our customers' favourite pieces.",
    "why_eyebrow": "The Portovero Standard",
    "why_subtitle": "Luxury isn't just about clothing. It's about confidence, quality and timeless style.",
    "testimonials_subtitle": "Discover why Portovero is becoming the reference for timeless luxury fashion.",
    "story_title": "Designed for timeless elegance.",
    "story_text": "Portovero celebrates Mediterranean simplicity with carefully selected pieces that combine premium craftsmanship, comfort and effortless sophistication.",
    "story_image": "/images/brand/story.jpeg",
    "about_title": "Timeless by design.",
    "about_text": (
        "Portovero is built around a simple idea: fewer pieces, better chosen.\n\n"
        "We believe in timeless silhouettes, considered materials and understated elegance.\n\n"
        "More than a brand, it's a way of life."
    ),
    "about_image": "/images/about.jpg",
    "about_image_alt": "Coastal town at golden hour",
    "newsletter_text": "Receive exclusive collections, early access and inspiration directly in your inbox.",
    "contact_subtitle": "We'd love to hear from you.",
    "shipping_info": "Orders are prepared within 48 hours. Delivery takes 2 to 5 business days depending on your wilaya.",
    "returns_info": "You can return any unworn item within 14 days of delivery, in its original condition.",
}

FAQ = [
    ("How long does shipping take?", "Orders are prepared within 48 hours. Delivery takes 2 to 5 business days depending on your wilaya."),
    ("What is your return policy?", "You can return any unworn item within 14 days of delivery, in its original condition."),
    ("Do you ship internationally?", "For now we deliver across Algeria only."),
    ("How can I track my order?", "Sign in to your account and open Orders: each order shows its current status."),
    ("What payment methods do you accept?", "Cash on delivery. More payment options will follow."),
    ("Can I cancel my order?", "Yes, as long as it has not been shipped. Contact us as soon as possible."),
    ("Do you offer gift cards?", "Not yet. Write to us if you would like to offer a Portovero piece."),
]

TESTIMONIALS = [
    ("Sarah B.", "Alger", "The quality exceeded my expectations. Elegant, comfortable and premium."),
    ("Amine K.", "Oran", "Minimalist design with exceptional fabric quality. I'll definitely order again."),
    ("Yasmine M.", "Constantine", "Fast delivery and beautiful packaging. It truly feels like a luxury brand."),
]

FEATURES = [
    ("ShieldCheck", "Premium Quality", "Every piece is carefully selected to meet luxury standards."),
    ("Truck", "Fast Delivery", "Reliable shipping with secure packaging."),
    ("Sparkles", "Timeless Design", "Minimal, elegant and made to last."),
    ("BadgeCheck", "Trusted Brand", "Thousands of satisfied customers across Algeria."),
]

VALUES = [
    ("Quality", "Not quantity. Every piece is chosen for the way it is made."),
    ("Timeless", "Silhouettes that outlast seasons and trends."),
    ("Since", "Est. 2024, built around one simple idea."),
]


def seed():
    db = SessionLocal()
    try:
        for key, value in SETTINGS.items():
            if db.get(SiteSetting, key) is None:
                db.add(SiteSetting(key=key, value=value))

        def fill(type_, rows):
            if db.query(ContentItem).filter(ContentItem.type == type_).count():
                return
            for position, row in enumerate(rows):
                db.add(ContentItem(type=type_, position=position, **row))

        fill("faq", [{"title": q, "text": a} for q, a in FAQ])
        fill(
            "testimonial",
            [{"title": n, "subtitle": loc, "text": t, "rating": 5} for n, loc, t in TESTIMONIALS],
        )
        fill("feature", [{"icon": i, "title": t, "text": d} for i, t, d in FEATURES])
        fill("value", [{"title": t, "text": d} for t, d in VALUES])

        db.commit()
        print("Contenu initial enregistré.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
