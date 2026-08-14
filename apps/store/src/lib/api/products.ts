import { apiClient } from "./client";

import {
  Product,
  ProductColor,
  ProductImage,
  ProductVariant,
} from "../../types/product";

import {
  ApiProduct,
  ApiProductList,
  ApiProductRating,
} from "../../types/api";

// =========================================================
// PRODUCTS LIST
// =========================================================

export function fetchProductList(skip = 0, limit = 20) {
  return apiClient<ApiProductList>(
    `/products/list?skip=${skip}&limit=${limit}`
  );
}

// =========================================================
// PRODUCTS FILTER
// =========================================================

export function fetchFilteredProducts(
  gender?: string,
  category?: string,
  skip = 0,
  limit = 20
) {
  const params = new URLSearchParams();

  if (gender) {
    params.set("gender", gender);
  }

  if (category) {
    params.set("category", category);
  }

  params.set("skip", String(skip));
  params.set("limit", String(limit));

  return apiClient<ApiProductList>(
    `/products/filter?${params.toString()}`
  );
}

// =========================================================
// FEATURED
// =========================================================

export function fetchFeaturedProducts(limit = 8) {
  return apiClient<ApiProduct[]>(
    `/products/featured?limit=${limit}`
  );
}

// =========================================================
// NEW PRODUCTS
// =========================================================

export function fetchNewProducts(limit = 8) {
  return apiClient<ApiProduct[]>(
    `/products/new?limit=${limit}`
  );
}

// =========================================================
// PRODUCT BY SLUG
// =========================================================

export function fetchProductBySlug(slug: string) {
  return apiClient<ApiProduct>(
    `/products/${slug}`
  );
}

// =========================================================
// PRODUCT COLORS
// =========================================================

interface RawProductColor {
  id: number;
  product_id: number;
  color_id: number;
}

export function fetchProductColors(productId: number) {
  return apiClient<{
    total: number;
    items: RawProductColor[];
  }>(
    `/product-colors/product/${productId}`
  );
}

// =========================================================
// PRODUCT IMAGES
// =========================================================

export function fetchProductImages(productColorId: number) {
  return apiClient<ProductImage[]>(
    `/product-images/color/${productColorId}`
  );
}

// =========================================================
// PRODUCT VARIANTS
// =========================================================

export function fetchVariantsByColor(productColorId: number) {
  return apiClient<ProductVariant[]>(
    `/product-variants/product-color/${productColorId}`
  );
}

// =========================================================
// COLOR
// =========================================================

export function fetchColor(colorId: number) {
  return apiClient<{
    id: number;
    name: string;
    hex_code: string;
  }>(
    `/colors/${colorId}`
  );
}

// =========================================================
// SIZE
// =========================================================

export function fetchSize(sizeId: number) {
  return apiClient<{
    id: number;
    name: string;
    display_order: number;
  }>(
    `/sizes/${sizeId}`
  );
}

// =========================================================
// RATING
// =========================================================

export function fetchProductRating(productId: number) {
  return apiClient<ApiProductRating>(
    `/reviews/product/${productId}/average`
  );
}

// =========================================================
// ADAPTER FOR LIST
// =========================================================

export function adaptToListProduct(
  p: ApiProduct
): Product {
  // -------------------------------------------------------
  // Calculate total stock from variants
  // -------------------------------------------------------

  const totalStock =
    p.colors?.reduce(
      (total, color) =>
        total +
        (color.variants?.reduce(
          (sum, variant) =>
            sum + variant.stock,
          0
        ) ?? 0),
      0
    ) ?? 0;

  // -------------------------------------------------------
  // Get all images
  // -------------------------------------------------------

  const allImages =
    p.colors?.flatMap(
      (color) => color.images ?? []
    ) ?? [];

  // -------------------------------------------------------
  // Primary image > first image
  // -------------------------------------------------------

  const primaryImage =
    allImages.find(
      (image) => image.is_primary
    ) ?? allImages[0];

  // -------------------------------------------------------
  // Adapt API product -> Frontend Product
  // -------------------------------------------------------

  return {
    id: String(p.id),

    name: p.name,
    slug: p.slug,

    description:
      p.description ?? "",

    base_price:
      Number(p.base_price),

    compare_at_price:
      p.compare_at_price !== null
        ? Number(p.compare_at_price)
        : null,

    stock: totalStock,

    weight:
      p.weight !== null
        ? Number(p.weight)
        : null,

    is_active:
      p.is_active,

    is_featured:
      p.is_featured,

    is_new:
      p.is_new,

    sku: p.sku,

    created_at:
      p.created_at,

    updated_at:
      p.updated_at,

    // =====================================================
    // FILTER DATA
    // =====================================================

    gender:
      p.gender ?? undefined,

    categories:
      p.categories?.map(({ id, name, slug }) => ({
        id,
        name,
        slug,
      })) ?? [],

    // =====================================================
    // PRODUCT CARD IMAGE
    // =====================================================

    images: primaryImage
      ? [primaryImage.image_url]
      : [],

    // =====================================================
    // COLORS
    // =====================================================

    colors:
      p.colors?.map((color) => ({
        id: color.id,
        product_id: color.product_id,
        color_id: color.color_id,
        color: color.color,

        images:
          color.images,

        variants:
          color.variants?.map((v) => ({
            ...v,
            sku: (v as any).sku ?? "",
          })) ?? [],
      })) ?? [],

    sizes: [],

    featured:
      p.is_featured,

    newArrival:
      p.is_new,
  };
}

// =========================================================
// FULL PRODUCT
// =========================================================

export async function getFullProduct(
  slug: string
): Promise<Product> {

  // -------------------------------------------------------
  // Get basic product
  // -------------------------------------------------------

  const p =
    await fetchProductBySlug(slug);

  // -------------------------------------------------------
  // Get product colors
  // -------------------------------------------------------

  const {
    items: rawColors,
  } =
    await fetchProductColors(p.id);

  // -------------------------------------------------------
  // Build complete colors
  // -------------------------------------------------------

  const colors: ProductColor[] =
    await Promise.all(
      rawColors.map(async (rc) => {

        const [
          color,
          images,
          variants,
        ] = await Promise.all([

          fetchColor(
            rc.color_id
          ),

          fetchProductImages(
            rc.id
          ),

          fetchVariantsByColor(
            rc.id
          ),
        ]);

        // -------------------------------------------------
        // Add size information to variants
        // -------------------------------------------------

        const variantsWithSize:
          ProductVariant[] =
          await Promise.all(

            variants.map(
              async (variant) => ({
                ...variant,

                size:
                  await fetchSize(
                    variant.size_id
                  ),
              })
            )
          );

        // -------------------------------------------------
        // Return complete ProductColor
        // -------------------------------------------------

        return {
          id: rc.id,

          product_id:
            rc.product_id,

          color_id:
            rc.color_id,

          color,

          images:
            images.sort(
              (a, b) =>
                (a.position ?? 0) -
                (b.position ?? 0)
            ),

          variants:
            variantsWithSize,
        };
      })
    );

  // =======================================================
  // Rating
  // =======================================================

  const rating =
    await fetchProductRating(
      p.id
    ).catch(() => ({
      average_rating: 0,
      total_reviews: 0,
    }));

  // =======================================================
  // Calculate total stock
  // =======================================================

  const totalStock =
    colors.reduce(
      (total, color) =>
        total +
        (color.variants?.reduce(
          (sum, variant) =>
            sum + variant.stock,
          0
        ) ?? 0),
      0
    );

  // =======================================================
  // Return complete product
  // =======================================================

  return {
    id: String(p.id),

    name: p.name,
    slug: p.slug,

    description:
      p.description ?? "",

    base_price:
      Number(p.base_price),

    compare_at_price:
      p.compare_at_price !== null
        ? Number(p.compare_at_price)
        : null,

    stock: totalStock,

    weight:
      p.weight !== null
        ? Number(p.weight)
        : null,

    is_active:
      p.is_active,

    is_featured:
      p.is_featured,

    is_new:
      p.is_new,

    sku: p.sku,

    created_at:
      p.created_at,

    updated_at:
      p.updated_at,

    // =====================================================
    // FILTER DATA
    // =====================================================

    gender:
      p.gender ?? undefined,

    categories:
      p.categories?.map(({ id, name, slug }) => ({
        id,
        name,
        slug,
      })) ?? [],

    // =====================================================
    // COLORS
    // =====================================================

    colors,

    // =====================================================
    // ALL PRODUCT IMAGES
    // =====================================================

    images:
      colors
        .flatMap(
          (color) =>
            color.images ?? []
        )
        .map(
          (image) =>
            image.image_url
        ),

    sizes: [],

    featured:
      p.is_featured,

    newArrival:
      p.is_new,

    rating:
      rating.average_rating,

    reviews:
      rating.total_reviews,
  };
}

// =========================================================
// STORE PRODUCTS
// =========================================================

export async function getProductsForStore(): Promise<Product[]> {
  const response =
    await fetchProductList(0, 100);

  return response.items.map(
    adaptToListProduct
  );
}

// =========================================================
// CATEGORIES
// =========================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  is_active: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  return apiClient<Category[]>(
    "/categories/active"
  );
}

export function searchProductsForStore(query: string) {
  return apiClient<Product[]>(
    `/products/search?q=${encodeURIComponent(query)}`
  );
}