import { ProductCard } from "../product/ProductCard";
import { getProductsForStore } from "../../lib/api/products";

export async function ProductGrid() {
  const products = await getProductsForStore();

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1500px]
          grid-cols-2
          gap-x-4
          gap-y-12
          px-5
          sm:gap-x-6
          sm:gap-y-14
          sm:px-8
          lg:grid-cols-3
          lg:gap-x-8
          lg:gap-y-16
          lg:px-12
          xl:grid-cols-4
          xl:gap-x-10
        "
      >
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