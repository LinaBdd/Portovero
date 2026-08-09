import { Product } from "../../types/product";
import { ProductCard } from "../product/ProductCard";
import { getProductsForStore } from "../../lib/api/products";

type Props = {
  currentProduct: Product;
};

export async function RelatedProducts({
  currentProduct,
}: Props) {
  const products = await getProductsForStore();

  // Même genre + même catégorie
  let related = products.filter(
    (p) =>
      p.id !== currentProduct.id &&
      p.gender === currentProduct.gender &&
      p.category === currentProduct.category
  );

  // Compléter avec le même genre
  if (related.length < 4) {
    const more = products.filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.gender === currentProduct.gender &&
        !related.some((r) => r.id === p.id)
    );

    related = [...related, ...more];
  }

  // Compléter avec les best sellers
  if (related.length < 4) {
    const more = products.filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.bestseller &&
        !related.some((r) => r.id === p.id)
    );

    related = [...related, ...more];
  }

  related = related.slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-28">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="uppercase tracking-[0.3em] text-[#C8A96A]">
            Recommended
          </p>

          <h2 className="mt-2 text-4xl font-serif">
            You may also like
          </h2>
        </div>
      </div>

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