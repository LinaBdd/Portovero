import { products } from "../../data/products";
import { ProductCard } from "../product/ProductCard";

export function ProductGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}