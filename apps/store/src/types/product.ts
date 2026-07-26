export type ProductCategory =
  | "shirts"
  | "tshirts"
  | "pants"
  | "hoodies"
  | "jackets"
  | "shoes"
  | "accessories";

export type ProductColor =
  | "Black"
  | "White"
  | "Beige"
  | "Navy"
  | "Green"
  | "Brown"
  | "Grey";

export type ProductSize =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL";

export interface Product {
  id: string;

  slug: string;

  name: string;

  description: string;

  price: number;

  oldPrice?: number;

  stock: number;

  rating: number;

  reviews: number;

  featured: boolean;

  bestseller: boolean;

  newArrival: boolean;

  gender: string;

  category: string;

  collection: string;

  colors: string[];

  sizes: string[];

  images: string[];

  tags: string[];
}