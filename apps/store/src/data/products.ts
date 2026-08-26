import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "shirt-001",
    slug: "premium-linen-shirt",
    name: "Premium Linen Shirt",
    description:
      "Crafted from premium Italian linen for exceptional comfort and timeless elegance.",

    base_price: 8900,
    compare_at_price: 9900,

    stock: 14,
    weight: null,
    is_active: true,
    is_featured: true,
    is_new: false,
    sku: "SHIRT-001",

    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",

    rating: 4.9,
    reviews: 187,

    featured: true,
    bestseller: true,
    newArrival: false,

    gender: "men",
    collection: "summer",

    categories: [
      {
        id: 1,
        name: "Shirts",
        slug: "shirts",
      },
    ],

    images: [
      "/images/products/shirt1.webp",
      "/images/products/shirt2.webp",
    ],

    sizes: [
      {
        id: 1,
        name: "S",
        display_order: 1,
      },
      {
        id: 2,
        name: "M",
        display_order: 2,
      },
      {
        id: 3,
        name: "L",
        display_order: 3,
      },
      {
        id: 4,
        name: "XL",
        display_order: 4,
      },
    ],

    colors: [
      {
        id: 1,
        product_id: 1,
        color_id: 1,
        color: {
          id: 1,
          name: "White",
          hex_code: "#FFFFFF",
        },
      },
      {
        id: 2,
        product_id: 1,
        color_id: 2,
        color: {
          id: 2,
          name: "Black",
          hex_code: "#000000",
        },
      },
      {
        id: 3,
        product_id: 1,
        color_id: 3,
        color: {
          id: 3,
          name: "Beige",
          hex_code: "#F5F5DC",
        },
      },
    ],

    tags: ["linen", "summer", "luxury"],
  },

  {
    id: "shirt-002",
    slug: "black-linen-shirt",
    name: "Black Linen Shirt",
    description: "Luxury black linen shirt.",

    base_price: 7900,
    compare_at_price: 8900,

    stock: 18,
    weight: null,
    is_active: true,
    is_featured: true,
    is_new: true,
    sku: "SHIRT-002",

    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",

    rating: 4.8,
    reviews: 81,

    featured: true,
    bestseller: false,
    newArrival: true,

    gender: "men",
    collection: "summer",

    categories: [
      {
        id: 1,
        name: "Shirts",
        slug: "shirts",
      },
    ],

    images: [
      "/images/products/shirt1.webp",
      "/images/products/shirt2.webp",
    ],

    sizes: [
      {
        id: 1,
        name: "S",
        display_order: 1,
      },
      {
        id: 2,
        name: "M",
        display_order: 2,
      },
      {
        id: 3,
        name: "L",
        display_order: 3,
      },
      {
        id: 4,
        name: "XL",
        display_order: 4,
      },
    ],

    colors: [
      {
        id: 4,
        product_id: 2,
        color_id: 2,
        color: {
          id: 2,
          name: "Black",
          hex_code: "#000000",
        },
      },
    ],

    tags: ["linen", "black", "summer"],
  },
];