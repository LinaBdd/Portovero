import { ProductCard } from "../../product";
import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

import { getFeaturedProductsForStore } from "../../../lib/api/products";

export async function BestSellers() {
  const bestSellers = await getFeaturedProductsForStore(4);

  return (
    <Section>

      <div className="mb-16 text-center">

        <H2>
          Best Sellers
        </H2>

        <Lead>
          Our customers' favourite pieces.
        </Lead>

      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </Section>
  );
}