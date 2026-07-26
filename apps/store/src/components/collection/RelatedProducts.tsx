import { products } from "../../data/products";

import { Product } from "../../types/product";

import { ProductCard } from "../product/ProductCard";

type Props = {
  currentProduct: Product;
};

export function RelatedProducts({
  currentProduct,
}: Props) {
  const related = products
    .filter(
      (p) =>
        p.category === currentProduct.category &&
        p.id !== currentProduct.id
    )
    .slice(0, 4);

  return (
    <section className="mt-28">

      <h2 className="mb-10 text-4xl font-serif">

        You may also like

      </h2>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {related.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}