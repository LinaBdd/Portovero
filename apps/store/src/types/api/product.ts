export interface ProductRead {
  id: number;
  slug: string;
  sku: string;
  name: string;

  description: string | null;

  base_price: string;
  compare_at_price: string | null;

  stock: number;
  weight: string | null;

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;

  created_at: string;
  updated_at: string;

  colors: ProductColorRead[];
}

export interface ProductList {
  total: number;
  items: ProductRead[];
}

export interface ProductColorRead {
  id: number;
  product_id: number;
  color_id: number;

  color?: ColorRead;

  images: ProductImageRead[];

  variants: ProductVariantRead[];
}

export interface ProductColorList {
  total: number;
  items: ProductColorRead[];
}

export interface ProductVariantRead {
  id: number;
  product_color_id: number;
  size_id: number;

  sku: string;
  stock: number;

  price: string | null;

  size?: SizeRead;
}

export interface ProductImageRead {
  id: number;
  product_color_id: number;

  image_url: string;

  alt: string | null;
  position: number;
  is_primary: boolean;
}

export interface ColorRead {
  id: number;
  name: string;
  hex_code: string;

  created_at?: string;
}

export interface SizeRead {
  id: number;
  name: string;
  display_order: number;

  created_at?: string;
}

export interface ProductRating {
  average_rating: number;
  total_reviews: number;
}