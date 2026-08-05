from fastapi import FastAPI
from sqlalchemy import text
from app.database.session import engine
from sqlalchemy import inspect
from app.routes.auth import router as auth_router
from app.auth.admin.register import router as admin_register_router
from app.routes.product import router as product_router
from app.routes.category import router as category_router
from app.routes.material import router as material_router
from app.routes.product_image import router as prod_im_router
from app.routes.color import router as color_router
from app.routes.product_color import router as product_color_router
from app.routes.size import router as size_router
from app.routes.cart import router as cart_router
from app.routes.product_variant import router as product_variant_router
from app.routes.wilaya import router as wilaya_router
from app.routes.commune import router as commune_router
from app.routes.address import router as address_router
from app.routes.shipping_method import router as shipping_method_router
from app.routes.order import router as order_router
from app.routes.payment import router as payment_router
from app.routes.checkout import router as checkout_router
from app.routes.coupon import router as coupon_router
from app.routes.wishlist import router as wishlist_router
from app.routes.review import router as review_router
from app.routes.admin import router as admin_router
from app.routes.newsletter import router as newsletter_router
from app.routes.notification import router as notification_router
from app.routes.banner import router as banner_router


app = FastAPI(
    title="Portovero API",
)


app.include_router(auth_router)
app.include_router(product_router)  
app.include_router(admin_register_router)
app.include_router(category_router)  
app.include_router(material_router)
app.include_router(prod_im_router)
app.include_router(color_router)
app.include_router(product_color_router)
app.include_router(size_router)
app.include_router(cart_router)
app.include_router(product_variant_router)
app.include_router(wilaya_router)
app.include_router(commune_router)
app.include_router(address_router)
app.include_router(shipping_method_router)
app.include_router(order_router)
app.include_router(payment_router)
app.include_router(checkout_router)
app.include_router(coupon_router)
app.include_router(wishlist_router)
app.include_router(review_router)
app.include_router(newsletter_router)
app.include_router(admin_router)    
app.include_router(notification_router)
app.include_router(banner_router)