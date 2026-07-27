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
  {
    id: "shirt-002",

    slug: "black-linen-shirt",

    name: "Black Linen Shirt",

    gender: "men",

    category: "shirts",

    collection: "summer",

    description:
      "Luxury black linen shirt.",

    price: 7900,

    oldPrice: 8900,

    rating: 4.8,

    reviews: 81,

    stock: 18,

    featured: true,

    bestseller: false,

    newArrival: true,

    colors: ["Black"],

    sizes: ["S","M","L","XL"],

    images:[
        "/images/products/shirt1.webp",
        "/images/products/shirt2.webp",
    ],

    tags:["linen","black","summer"],
},
];