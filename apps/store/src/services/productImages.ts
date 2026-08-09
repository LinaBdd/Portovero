import api from "./api";

export interface ProductImage {
  id: number;
  product_color_id: number;
  image_url: string;
  is_primary?: boolean;
  display_order?: number;
}

/**
 * Récupérer une image
 */
export const getProductImage = async (
  imageId: number
): Promise<ProductImage> => {
  const response = await api.get(
    `/product-images/${imageId}`
  );

  return response.data;
};

/**
 * Récupérer toutes les images d'une couleur
 */
export const getProductImagesByColor = async (
  productColorId: number
): Promise<ProductImage[]> => {
  const response = await api.get(
    `/product-images/color/${productColorId}`
  );

  return response.data;
};

/**
 * Créer une image
 */
export const createProductImage = async (data: {
  product_color_id: number;
  image_url: string;
  is_primary?: boolean;
  display_order?: number;
}): Promise<ProductImage> => {
  const response = await api.post(
    "/product-images/",
    data
  );

  return response.data;
};

/**
 * Modifier une image
 */
export const updateProductImage = async (
  imageId: number,
  data: {
    image_url?: string;
    is_primary?: boolean;
    display_order?: number;
  }
): Promise<ProductImage> => {
  const response = await api.put(
    `/product-images/${imageId}`,
    data
  );

  return response.data;
};

/**
 * Supprimer une image
 */
export const deleteProductImage = async (
  imageId: number
): Promise<void> => {
  await api.delete(
    `/product-images/${imageId}`
  );
};