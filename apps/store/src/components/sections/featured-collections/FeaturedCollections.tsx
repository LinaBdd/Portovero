import { Section } from "../../ui/section";
import { H2 } from "../../ui/typography";

import { CollectionCard } from "./CollectionCard";
import { categoryHref, categoryImage } from "../../../lib/api/categories";
import { getCategories } from "../../../lib/api/site";

/** Collections en vedette : les catégories actives (avec image) gérées depuis l'admin. */
export async function FeaturedCollections() {
  const categories = (await getCategories())
    .filter((category) => category.image)
    .slice(0, 4);

  if (categories.length === 0) return null;

  return (
    <Section>
      <div className="mb-16 text-center">
        <H2>Collections</H2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {categories.map((category) => (
          <CollectionCard
            key={category.id}
            title={category.name}
            subtitle={category.description ?? ""}
            image={categoryImage(category.image) ?? ""}
            href={categoryHref(category.slug)}
          />
        ))}
      </div>
    </Section>
  );
}
