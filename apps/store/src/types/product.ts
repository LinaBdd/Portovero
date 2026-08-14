export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;

  base_price: number;
  compare_at_price: number | null;

  stock: number;
  weight: number | null;

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;

  sku: string;

  created_at: string;
  updated_at: string;

  colors?: ProductColor[];
  images?: string[];
  sizes?: Size[];

  rating?: number;
  reviews?: number;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;

  gender?: string;
  categories?: {
   id: number;
   name: string;
   slug: string;
  }[];
  collection?: string;
  tags?: string[];
}
export interface ProductColor {
  id: number;

  product_id: number;
  color_id: number;

  color?: Color;

  images?: ProductImage[];

  variants?: ProductVariant[];
}

export interface ProductImage {
  id: number;

  product_color_id: number;

  image_url: string;

  alt?: string | null;

  position?: number | null;

  is_primary?: boolean;
}

export interface Color {
  id: number;

  name: string;

  hex_code: string;
}

export interface ProductVariant {
  id: number;

  product_color_id: number;
  size_id: number;

  sku: string;

  stock: number;

  price?: string | number | null;

  size?: Size;
}

export interface Size {
  id: number;

  name: string;

  display_order: number;
}

export interface ProductImageRead {
  id: number;
  product_color_id: number;
  image_url: string;
  alt?: string | null;
  position?: number | null;
  is_primary: boolean;
}

export interface ColorRead {
  id: number;
  name: string;
  hex_code: string;
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

export interface SizeRead {
  id: number;
  name: string;
  display_order: number;
}

export interface ProductColorRead {
  id: number;
  product_id: number;
  color_id: number;

  color?: ColorRead;

  images: ProductImageRead[];

  variants: ProductVariantRead[];
}

export interface ProductRead {
  id: number;
  name: string;
  slug: string;
  description: string | null;

  base_price: string;
  compare_at_price: string | null;

  stock: number;
  weight: string | null;

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;

  sku: string;

  created_at: string;
  updated_at: string;

  colors: ProductColorRead[];
}
export interface ProductRating {
  average_rating: number;
  total_reviews: number;
}

export interface ProductColorList {
  total: number;
  items: ProductColorRead[];
}