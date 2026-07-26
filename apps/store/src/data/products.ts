import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "shirt-001",

    slug: "premium-linen-shirt",

    name: "Premium Linen Shirt",

    gender: "men",

    category: "shirts",

    collection: "summer",

    description:
      "Crafted from premium Italian linen for exceptional comfort and timeless elegance.",

    price: 8900,

    oldPrice: 9900,

    rating: 4.9,

    reviews: 187,

    stock: 14,

    featured: true,

    bestseller: true,

    newArrival: false,

    colors: ["White", "Black", "Beige"],

    sizes: ["S", "M", "L", "XL"],

    images: [
  "/images/products/shirt1.webp",
  "/images/products/shirt2.webp",
   ],

    tags: ["linen", "summer", "luxury"],
  },
];