import { apiClient, clearAdminSession } from "./client";
import { API_URL as BASE_URL } from "./config";

/* ============================================================
   COLORS
============================================================ */

export interface ApiColor {
  id: number;
  name: string;
  hex_code: string;
}

/* ============================================================
   IMAGES
============================================================ */

export interface ApiImage {
  id: number;
  product_color_id: number;
  image_url: string;
  alt: string | null;
  position: number;
  is_primary: boolean;
}

/* ============================================================
   SIZES
============================================================ */

export interface ApiSize {
  id: number;
  name: string;
  display_order: number;
}

/* ============================================================
   VARIANTS
============================================================ */

export interface ApiVariant {
  id: number;
  product_color_id: number;
  size_id: number;
  sku: string;
  stock: number;
  price: string;
  old_price: string | null;
  is_active: boolean;
  size: ApiSize;
}

/* ============================================================
   PRODUCT COLORS
============================================================ */

export interface ApiProductColor {
  id: number;
  product_id: number;
  color_id: number;
  color: ApiColor;
  images: ApiImage[];
  variants: ApiVariant[];
}

/* ============================================================
   CATEGORIES
============================================================ */

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiProductCategory {
  category: ApiCategory;
}

/* ============================================================
   PRODUCT
============================================================ */

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;

  base_price: string;
  compare_at_price: string | null;

  stock: number;

  weight: string | null;
  cost_price: string | null;
  gender: string | null;

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;

  sku: string;

  created_at: string;
  updated_at: string;

  colors: ApiProductColor[];
  categories: ApiProductCategory[];

  profit: number | null;
}

/* ============================================================
   PRODUCT LIST RESPONSE
============================================================ */

export interface ProductsResponse {
  total: number;
  items: ApiProduct[];
}

/* ============================================================
   PRODUCT CREATION PAYLOAD
============================================================ */

export interface ProductImagePayload {
  url: string;
  alt?: string | null;
  position: number;
  is_primary: boolean;
}

export interface ProductColorPayload {
  color_id: number;
  images: ProductImagePayload[];
}

export interface ProductVariantPayload {
  id?: number;
  color_id: number;
  size_id: number;
  stock: number;
  price: number;
  old_price?: number | null;
  is_active: boolean;
}

export interface ProductPayload {
  name: string;
  description?: string | null;

  base_price: number;
  compare_at_price?: number | null;
  cost_price?: number | null;

  weight?: number | null;
  gender?: string | null;

  category_id: number | null;

  colors: ProductColorPayload[];
  variants: ProductVariantPayload[];

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
}

/* ============================================================
   SIMPLE CATEGORY / COLOR / SIZE
============================================================ */

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface Color {
  id: number;
  name: string;
  hex_code?: string;
}

export interface Size {
  id: number;
  name: string;
  display_order?: number;
}

/* ============================================================
   FETCH PRODUCTS
============================================================ */

export function fetchProducts(
  skip = 0,
  limit = 50
) {
  return apiClient<ProductsResponse>(
    `/products/list?skip=${skip}&limit=${limit}`
  );
}

/* ============================================================
   FETCH ONE PRODUCT
============================================================ */

export function fetchProduct(id: number) {
  return apiClient<ApiProduct>(
    `/products/id/${id}`
  );
}

/* ============================================================
   CREATE PRODUCT
============================================================ */

/**
 * Création complète depuis l'admin.
 *
 * Le backend crée :
 * - Product
 * - ProductCategory
 * - ProductColor
 * - ProductImage
 * - ProductVariant
 */

export function createProduct(
  data: ProductPayload
) {
  return apiClient<ApiProduct>(
    "/admin/products/create",
    {
      method: "POST",
      body: data,
    }
  );
}

/* ============================================================
   UPDATE PRODUCT
============================================================ */

export function updateProduct(
  id: number,
  data: Partial<ProductPayload>
) {
  return apiClient<ApiProduct>(
    `/admin/products/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );
}

/* ============================================================
   VARIANT STOCK
============================================================ */

export interface UpdateVariantStockPayload {
  stock: number;
}

export function updateVariantStock(
  variantId: number,
  stock: number
) {
  return apiClient<ApiVariant>(
    `/admin/product-variants/${variantId}/stock`,
    {
      method: "PATCH",
      body: {
        stock,
      },
    }
  );
}

/* ============================================================
   DELETE PRODUCT
============================================================ */

export function deleteProduct(id: number) {
  return apiClient(
    `/products/${id}`,
    {
      method: "DELETE",
    }
  );
}

/* ============================================================
   CATEGORIES
============================================================ */

export function fetchCategories() {
  return apiClient<{
    total: number;
    items: Category[];
  }>("/categories");
}

/* ============================================================
   COLORS
============================================================ */

export function fetchColors() {
  return apiClient<{
    total: number;
    items: Color[];
  }>("/colors");
}

/* ============================================================
   SIZES
============================================================ */

export function fetchSizes() {
  return apiClient<{
    total: number;
    items: Size[];
  }>("/sizes");
}

/* ============================================================
   UPLOAD PRODUCT IMAGE
============================================================ */

export async function uploadProductImage(
  file: File
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);

  const token =
    typeof window !== "undefined"
      ? (() => {
          try {
            const raw = localStorage.getItem(
              "portovero-admin-auth"
            );

            if (!raw) {
              return null;
            }

            const parsed = JSON.parse(raw);

            return parsed?.state?.token ?? null;
          } catch {
            return null;
          }
        })()
      : null;

  const response = await fetch(
    `${BASE_URL}/admin/upload/image`,
    {
      method: "POST",

      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },

      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text();

    if (response.status === 401) {
      clearAdminSession();
    }

    throw new Error(
      text || "Erreur lors de l'upload de l'image"
    );
  }

  const data = await response.json();

  return data.url;
}