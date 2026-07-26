import { products } from "../../../data/products";

export const bestSellers = products.filter(
  (product) => product.bestseller
);