import { Section } from "../../ui/section";
import { H2, Lead } from "../../ui/typography";

import { CollectionCard } from "./CollectionCard";
import { fetchFeaturedCollections } from "../../../lib/api/collections";


export async function FeaturedCollections() {

  const collections =
    await fetchFeaturedCollections();


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
               key={collection.id}
               title={collection.title}
               subtitle={collection.description ?? ""}
               image={collection.image ?? ""}
               href={`/collections/${collection.slug}`}
             />
           ))}

      </div>

    </Section>
  );
}