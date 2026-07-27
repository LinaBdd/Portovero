import { products } from "../../data/products";
import { ProductCard } from "../product";

export function ProductGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

      {products.map((product) => (

        <ProductCard
          key={product.id}
          product={product}
        />

      ))}

    </div>
  );
}