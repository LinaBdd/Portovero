import { notFound } from "next/navigation";

import { ProductCard } from "../../../components/product";
import { Section } from "../../../components/ui/section";
import { H1 } from "../../../components/ui/typography";
import { getProductsForStore } from "../../../lib/api/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CollectionPage({
  params,
}: Props) {

  const { slug } = await params;

  const products = await getProductsForStore();

  const collectionProducts = products.filter(
    (product) => product.gender === slug
  );

  if (collectionProducts.length === 0) {
    notFound();
  }

  return (
    <Section>

      <div className="mb-16">

        <H1 className="capitalize">
          {slug}
        </H1>

      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {collectionProducts.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </Section>
  );
}