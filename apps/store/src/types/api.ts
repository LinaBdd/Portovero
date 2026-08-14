export interface ApiProduct {
  id: number;
  name: string;
  description: string | null;

  base_price: string;
  compare_at_price: string | null;

  stock: number;
  weight: string | null;

  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;

  slug: string;
  sku: string;

  created_at: string;
  updated_at: string;

  // Filtres
  gender?: string | null;
  categories?: {
   id: number;
    name: string;
    slug: string;
  }[];

  colors?: ApiProductColor[];
}


export interface ApiProductList {
  total: number;
  items: ApiProduct[];
}

export interface ApiColor {
  id: number;
  name: string;
  hex_code: string;
}

export interface ApiProductColor {
  id: number;
  product_id: number;
  color_id: number;

  color?: ApiColor;

  images: ApiProductImage[];

  variants?: ApiProductVariant[];
}

export interface ApiProductImage {
  id: number;
  product_color_id: number;
  image_url: string;
  alt: string | null;
  position: number;
  is_primary: boolean;
}

export interface ApiProductVariant {
  id: number;
  product_color_id: number;
  size_id: number;

  stock: number;

  price: string;
  old_price: string | null;

  is_active: boolean;

  size?: ApiSize;
}

export interface ApiSize {
  id: number;
  name: string;
  display_order: number;
}

export interface ApiProductRating {
  average_rating: number;
  total_reviews: number;
}