import { apiClient } from "./client";

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: string;
  compare_at_price: string | null;
  stock: number;
  weight: string | null;
  gender: string | null;
  category_id: number | null;
  image_url: string | null;
  color: string | null;
  variant: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  sku: string;
}

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

  stock: number;
  weight?: number | null;

  gender?: string | null;

  category_id: number | null;

  colors: ProductColorPayload[];

  variants: ProductVariantPayload[];

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  is_primary: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductColor {
  id: number;
  name: string;
  hex: string | null;
}

export interface ProductVariant {
  id: number;
  sku: string;
  size: string | null;
  stock: number;
  price: string | null;
}

export function fetchProducts(skip = 0, limit = 50) {
  return apiClient<{ total: number; items: ApiProduct[] }>(
    `/products/list?skip=${skip}&limit=${limit}`
  );
}

export function fetchProduct(id: number) {
  return apiClient<ApiProduct>(`/products/id/${id}`);
}

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
export function createProduct(data: ProductPayload) {
  return apiClient<ApiProduct>("/products/create", {
    method: "POST",
    body: data,
  });
}

export function updateProduct(
  id: number,
  data: Partial<ProductPayload>
) {
  return apiClient<ApiProduct>(`/products/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteProduct(id: number) {
  return apiClient(`/products/${id}`, {
    method: "DELETE",
  });
}

export interface Category {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface Size {
  id: number;
  name: string;
}

export function fetchCategories() {
  return apiClient<{
    total: number;
    items: Category[];
  }>("/categories");
}

export function fetchColors() {
  return apiClient<{
    total: number;
    items: Color[];
  }>("/colors");
}

export function fetchSizes() {
  return apiClient<{
    total: number;
    items: Size[];
  }>("/sizes");
}


export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/uploads/image`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erreur lors de l'upload de l'image");
  }

  const data = await response.json();

  return data.url;
}