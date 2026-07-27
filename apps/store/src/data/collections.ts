export interface Collection {
  name: string;
  slug: string;
  image: string;
}

export const collections: Collection[] = [
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