import api from "./api";

/* ============================
   Interfaces
============================ */

export interface ProductFilters {
  search?: string;
  category?: string;
  color?: string;
  size?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

export interface ProductCreate {
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  gender?: string;
  sku: string;
  base_price: number;
  compare_at_price?: number;
  stock: number;
  weight?: number;
  material_id?: number;
  is_new?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
}

export type ProductUpdate = Partial<ProductCreate>;

/* ============================
   Public Store
============================ */

export const getProducts = async () => {
  const { data } = await api.get("/products/list");
  return data;
};

export const getFeaturedProducts = async () => {
  const { data } = await api.get("/products/featured");
  return data;
};

export const getNewProducts = async () => {
  const { data } = await api.get("/products/new");
  return data;
};

export const getProduct = async (slug: string) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const searchProducts = async (
  filters: ProductFilters
) => {
  const { data } = await api.get("/products/search", {
    params: filters,
  });

  return data;
};

/* ============================
   Admin
============================ */

export const createProduct = async (
  product: ProductCreate
) => {
  const { data } = await api.post(
    "/products/create",
    product
  );

  return data;
};

export const updateProduct = async (
  productId: number,
  product: ProductUpdate
) => {
  const { data } = await api.patch(
    `/products/${productId}`,
    product
  );

  return data;
};

export const deleteProduct = async (
  productId: number
) => {
  const { data } = await api.delete(
    `/products/${productId}`
  );

  return data;
};

export const decreaseStock = async (
  productId: number,
  quantity: number
) => {
  const { data } = await api.patch(
    `/products/${productId}/stock`,
    {
      quantity,
    }
  );

  return data;
};

/* ============================
   Product Details
============================ */

export const getProductColors = async (
  productId: number
) => {
  const { data } = await api.get(
    `/product-colors/product/${productId}`
  );

  return data;
};

export const getProductVariants = async (
  productColorId: number
) => {
  const { data } = await api.get(
    `/product-variants/product-color/${productColorId}`
  );

  return data;
};

export const getProductImages = async (
  productColorId: number
) => {
  const { data } = await api.get(
    `/product-images/color/${productColorId}`
  );

  return data;
};

export const getProductReviews = async (
  productId: number
) => {
  const { data } = await api.get(
    `/reviews/product/${productId}`
  );

  return data;
};

export const getAverageRating = async (
  productId: number
) => {
  const { data } = await api.get(
    `/reviews/product/${productId}/average`
  );

  return data;
};