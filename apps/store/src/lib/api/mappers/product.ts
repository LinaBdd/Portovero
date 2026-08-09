import {
  ProductRead,
  ProductRating,
} from "../../../types/api/product";

import {
  Product,
  ProductColor,
  ProductImage,
  ProductVariant,
  Size,
} from "../../../types/product";

type ProductExtras = {
  rating?: number;
  reviews?: number;
};

export function mapProductReadToProduct(
  api: ProductRead,
  extras: ProductExtras = {}
): Product {
  // =========================
  // COLORS
  // =========================

  const colors: ProductColor[] = (api.colors ?? []).map(
    (color) => ({
      id: color.id,

      product_id: color.product_id,

      color_id: color.color_id,

      color: color.color
        ? {
            id: color.color.id,
            name: color.color.name,
            hex_code: color.color.hex_code,
          }
        : undefined,

      // =========================
      // IMAGES
      // =========================

      images: (color.images ?? []).map(
        (image): ProductImage => ({
          id: image.id,

          product_color_id:
            image.product_color_id,

          image_url: image.image_url,

          alt: image.alt,

          position: image.position,

          is_primary: image.is_primary,
        })
      ),

      // =========================
      // VARIANTS
      // =========================

      variants: (color.variants ?? []).map(
        (variant): ProductVariant => ({
          id: variant.id,

          product_color_id:
            variant.product_color_id,

          size_id: variant.size_id,

          sku: variant.sku,

          stock: variant.stock,

          price:
            variant.price !== null &&
            variant.price !== undefined
              ? Number(variant.price)
              : null,

          size: variant.size
            ? {
                id: variant.size.id,

                name: variant.size.name,

                display_order:
                  variant.size.display_order,
              }
            : undefined,
        })
      ),
    })
  );

  // =========================
  // ALL PRODUCT IMAGES
  // =========================

  const images = colors
    .flatMap(
      (color) => color.images ?? []
    )
    .sort(
      (a, b) =>
        (a.position ?? 0) -
        (b.position ?? 0)
    )
    .map(
      (image) => image.image_url
    );

  // =========================
  // ALL AVAILABLE SIZES
  // =========================

  const sizes: Size[] = Array.from(
    new Map(
      colors
        .flatMap(
          (color) => color.variants ?? []
        )
        .filter(
          (variant) => variant.size
        )
        .map((variant) => [
          variant.size!.id,
          variant.size!,
        ])
    ).values()
  ).sort(
    (a, b) =>
      a.display_order -
      b.display_order
  );

  // =========================
  // FINAL PRODUCT
  // =========================

  return {
    id: String(api.id),

    name: api.name,

    slug: api.slug,

    description:
      api.description ?? "",

    base_price:
      String(api.base_price),

    compare_at_price:
      api.compare_at_price !== null &&
      api.compare_at_price !== undefined
        ? String(api.compare_at_price)
        : null,

    stock: api.stock,

    weight:
      api.weight !== null &&
      api.weight !== undefined
        ? String(api.weight)
        : null,

    is_active: api.is_active,

    is_featured:
      api.is_featured,

    is_new: api.is_new,

    sku: api.sku,

    created_at: api.created_at,

    updated_at: api.updated_at,

    // Important
    colors,

    // Gallery
    images,

    // Available sizes
    sizes,

    // Rating
    rating:
      extras.rating ?? 0,

    reviews:
      extras.reviews ?? 0,

    // Legacy frontend fields
    featured:
      api.is_featured,

    bestseller: false,

    newArrival:
      api.is_new,

    gender: "unisex",

    category: "accessories",

    collection: "",

    tags: [],
  };
}

// =========================
// RATING
// =========================

export function applyRating(
  product: Product,
  rating: ProductRating
): Product {
  return {
    ...product,

    rating:
      rating.average_rating,

    reviews:
      rating.total_reviews,
  };
}