import { getProductsForStore } from "../../lib/api/products";
import { ProductCard } from "../product";

export async function ProductGrid() {
  const items = await getProductsForStore();

  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

      {items.map((product) => (

        <ProductCard
          key={product.id}
          product={product}
        />

      ))}

    </div>
  );
}