import { fetchFeaturedProducts, adaptToListProduct } from "../../../lib/api/products";
import { getSettings } from "../../../lib/api/site";
import { ProductCard } from "../../product";
import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

export async function BestSellers() {
  const [items, settings] = await Promise.all([
    fetchFeaturedProducts(8),
    getSettings(),
  ]);
  const products = items.map(adaptToListProduct);

  if (products.length === 0) return null;

  return (
    <Section>
      <div className="mb-16 text-center">
        <H2>{settings.best_sellers_title}</H2>
        {settings.best_sellers_subtitle && (
          <Lead>{settings.best_sellers_subtitle}</Lead>
        )}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Section>
  );
}
