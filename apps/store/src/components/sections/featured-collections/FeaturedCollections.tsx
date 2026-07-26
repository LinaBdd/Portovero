import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

import { CollectionCard } from "./CollectionCard";
import { collections } from "./data";

export function FeaturedCollections() {
  return (
    <Section>

      <div className="mb-16 text-center">

        <H2>
          Featured Collections
        </H2>

        <Lead>
          Explore our timeless wardrobe.
        </Lead>

      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.title}
            {...collection}
          />
        ))}
      </div>

    </Section>
  );
}