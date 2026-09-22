import { Product } from "../../types/product";
import { ProductCard } from "../product/ProductCard";
import { fetchProductList, adaptToListProduct } from "../../lib/api/products";

type Props = {
  currentProduct: Product;
};

export async function RelatedProducts({ currentProduct }: Props) {
  const { items } = await fetchProductList(0, 20);
  const products = items.map(adaptToListProduct);

  let related = products.filter((p) => p.id !== currentProduct.id);

  related = [
    ...related.filter((p) => p.is_featured),
    ...related.filter((p) => !p.is_featured),
  ].slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
  <div className="flex flex-wrap justify-center gap-8">
    {related.map((product) => (
      <div
        key={product.id}
        className="w-full sm:w-[calc(50%-1rem)] xl:w-[calc(25%-1.5rem)]"
      >
        <ProductCard product={product} />
      </div>
    ))}
  </div>
 );
}