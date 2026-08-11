import api from "./api";

export interface ProductColor {
  id: number;
  product_id: number;
  color_id: number;

  color?: {
    id: number;
    name: string;
    hex_code: string;
  };
}

export const getProductColors = async (
  productId: number
): Promise<ProductColor[]> => {
  const response = await api.get(
    `/product-colors/product/${productId}`
  );

  return response.data.items;
};

export const getProductColor = async (
  productColorId: number
): Promise<ProductColor> => {
  const response = await api.get(
    `/product-colors/${productColorId}`
  );

  return response.data;
};

export const createProductColor = async (data: {
  product_id: number;
  color_id: number;
}): Promise<ProductColor> => {
  const response = await api.post(
    "/product-colors/create",
    data
  );

  return response.data;
};

export const updateProductColor = async (
  productColorId: number,
  data: {
    product_id?: number;
    color_id?: number;
  }
): Promise<ProductColor> => {
  const response = await api.put(
    `/product-colors/${productColorId}`,
    data
  );

  return response.data;
};

export const deleteProductColor = async (
  productColorId: number
): Promise<void> => {
  await api.delete(
    `/product-colors/${productColorId}`
  );
};