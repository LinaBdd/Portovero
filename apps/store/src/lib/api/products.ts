import { Product } from "../../types/product";
import { products as mockProducts } from "../../data/products";
import {
  ColorRead,
  ProductColorList,
  ProductImageRead,
  ProductList,
  ProductRating,
  ProductRead,
  ProductVariantRead,
  SizeRead,
} from "../../types/api/product";
import { apiClient } from "./client";
import {
  applyRating,
  mapProductReadToProduct,
} from "./mappers/product";

async function getProductRating(productId: number): Promise<ProductRating> {
  return apiClient<ProductRating>(`/reviews/product/${productId}/average`);
}

async function getProductColors(productId: number): Promise<ProductColorList> {
  return apiClient<ProductColorList>(`/product-colors/product/${productId}`);
}

async function getColor(colorId: number): Promise<ColorRead> {
  return apiClient<ColorRead>(`/colors/${colorId}`);
}

async function getSize(sizeId: number): Promise<SizeRead> {
  return apiClient<SizeRead>(`/sizes/${sizeId}`);
}

async function getProductImages(
  productColorId: number
): Promise<ProductImageRead[]> {
  return apiClient<ProductImageRead[]>(
    `/product-images/color/${productColorId}`
  );
}

async function getVariantsByProductColor(
  productColorId: number
): Promise<ProductVariantRead[]> {
  return apiClient<ProductVariantRead[]>(
    `/product-variants/product-color/${productColorId}`
  );
}

async function enrichProduct(apiProduct: ProductRead): Promise<Product> {
  const [rating, productColors] = await Promise.all([
    getProductRating(apiProduct.id).catch(() => ({
      average_rating: 0,
      total_reviews: 0,
    })),
    getProductColors(apiProduct.id),
  ]);

  const colorEntries = await Promise.all(
    productColors.items.map(async (productColor) => {
      const [color, images, variants] = await Promise.all([
        getColor(productColor.color_id),
        getProductImages(productColor.id).catch(() => []),
        getVariantsByProductColor(productColor.id).catch(() => []),
      ]);

      return { color, images, variants };
    })
  );

  const colors = [
    ...new Set(colorEntries.map((entry) => entry.color.name)),
  ];

  const sizeIds = [
    ...new Set(
      colorEntries.flatMap((entry) =>
        entry.variants.map((variant) => variant.size_id)
      )
    ),
  ];

  const sizes = await Promise.all(sizeIds.map((sizeId) => getSize(sizeId)));
  const sortedSizes = sizes
    .sort((a, b) => a.display_order - b.display_order)
    .map((size) => size.name);

  const images = colorEntries
    .flatMap((entry) => entry.images)
    .sort((a, b) => a.position - b.position)
    .map((image) => image.image_url);

  const product = mapProductReadToProduct(apiProduct, {
    colors,
    sizes: sortedSizes,
    images: images.length > 0 ? images : undefined,
  });

  return applyRating(product, rating);
}

export async function fetchProducts(
  skip = 0,
  limit = 20
): Promise<Product[]> {
  const data = await apiClient<ProductList>(
    `/products/list?skip=${skip}&limit=${limit}`
  );

  return data.items.map((item) => mapProductReadToProduct(item));
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const data = await apiClient<ProductRead[]>(
    `/products/featured?limit=${limit}`
  );

  return data.map((item) => mapProductReadToProduct(item));
}

export async function fetchNewProducts(limit = 8): Promise<Product[]> {
  const data = await apiClient<ProductRead[]>(`/products/new?limit=${limit}`);

  return data.map((item) =>
    mapProductReadToProduct(item, { bestseller: false })
  );
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const data = await apiClient<ProductRead>(`/products/${slug}`);
  return enrichProduct(data);
}

export async function searchProducts(
  query: string,
  skip = 0,
  limit = 20
): Promise<Product[]> {
  const data = await apiClient<ProductList>(
    `/products/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`
  );

  return data.items.map((item) => mapProductReadToProduct(item));
}

async function withMockFallback<T>(
  fetcher: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback();
  }
}

export async function getProductsForStore(): Promise<Product[]> {
  return withMockFallback(fetchProducts, () => mockProducts);
}

export async function getFeaturedProductsForStore(
  limit = 8
): Promise<Product[]> {
  return withMockFallback(
    () => fetchFeaturedProducts(limit),
    () => mockProducts.filter((product) => product.featured).slice(0, limit)
  );
}

export async function getProductBySlugForStore(
  slug: string
): Promise<Product | null> {
  try {
    return await fetchProductBySlug(slug);
  } catch {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function searchProductsForStore(query: string): Promise<Product[]> {
  if (!query.trim()) {
    return getProductsForStore();
  }

  return withMockFallback(
    () => searchProducts(query),
    () => {
      const value = query.toLowerCase().trim();

      return mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value) ||
          product.category.toLowerCase().includes(value) ||
          product.gender.toLowerCase().includes(value) ||
          product.description.toLowerCase().includes(value) ||
          product.tags.some((tag) => tag.toLowerCase().includes(value))
      );
    }
  );
}
