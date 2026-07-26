import Link from "next/link";

import { Section } from "../../components/ui/section";
import { H1, Lead } from "../../components/ui/typography";

const collections = [
  {
    name: "Men",
    slug: "men",
    image: "/images/collections/men.jpeg",
  },
  {
    name: "Women",
    slug: "women",
    image: "/images/collections/women.jpeg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/images/collections/accessories.webp",
  },
  {
    name: "Summer",
    slug: "summer",
    image: "/images/collections/summer.jpeg",
  },
];

export default function CollectionsPage() {
  return (
    <Section>

      <div className="mb-16 text-center">

        <H1>Collections</H1>

        <Lead>
          Explore our curated luxury collections.
        </Lead>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {collections.map((collection) => (

          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group overflow-hidden rounded-3xl border"
          >

            <img
              src={collection.image}
              alt={collection.name}
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="p-6">

              <h2 className="text-2xl font-serif">
                {collection.name}
              </h2>

            </div>

          </Link>

        ))}

      </div>

    </Section>
  );
}