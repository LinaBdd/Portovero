import { Product } from "../../types/product";
import { ProductCard } from "../product/ProductCard";
import { fetchProductList, adaptToListProduct } from "../../lib/api/products";

type Props = {
  currentProduct: Product;
};

export async function RelatedProducts({ currentProduct }: Props) {
  const { items } = await fetchProductList(0, 20);
  const products = items.map(adaptToListProduct);

  // Exclure le produit courant, garder les autres produits actifs
  let related = products.filter((p) => p.id !== currentProduct.id);

  // Priorité aux produits mis en avant (featured), sinon nouveaux
  related = [
    ...related.filter((p) => p.is_featured),
    ...related.filter((p) => !p.is_featured),
  ];

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
          <h2 className="mt-2 text-4xl font-serif">You may also like</h2>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}