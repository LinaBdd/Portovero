import { fetchFeaturedProducts, adaptToListProduct } from "../../../lib/api/products";
import { ProductCard } from "../../product";
import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

export async function BestSellers() {
  const items = await fetchFeaturedProducts(8);
  const products = items.map(adaptToListProduct);

  return (
    <Section>
      <div className="mb-16 text-center">
        <H2>Best Sellers</H2>
        <Lead>Our customers' favourite pieces.</Lead>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Section>
  );
}