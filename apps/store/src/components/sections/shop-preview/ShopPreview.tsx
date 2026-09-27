import Link from "next/link";

import {
  adaptToListProduct,
  fetchFilteredProducts,
} from "../../../lib/api/products";
import type { Product } from "../../../types/product";
import { ProductCard } from "../../product";
import { Button } from "../../ui/button";
import { Section } from "../../ui/section";
import { Caption, H2, Lead } from "../../ui/typography";

const PREVIEW_SIZE = 8;

async function getPreviewProducts(): Promise<Product[]> {
  // Même catalogue que la page /shop (homme uniquement pour le moment)
  const { items } = await fetchFilteredProducts("men", undefined, 0, 100);

  const newestFirst = [...items].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  // Les produits mis en avant sont déjà dans « Best sellers », juste au-dessus
  const notFeatured = newestFirst.filter((product) => !product.is_featured);
  const selection = notFeatured.length >= 4 ? notFeatured : newestFirst;

  return selection.slice(0, PREVIEW_SIZE).map(adaptToListProduct);
}

export async function ShopPreview() {

  let products: Product[];

  try {
    products = await getPreviewProducts();
  } catch (error) {
    // Une erreur de l'API ne doit pas casser toute la page d'accueil
    console.error("ShopPreview: failed to load products", error);
    return null;
  }

  if (products.length === 0) return null;

  return (
    <Section className="bg-[#EDE5DA]">
      <div className="mb-16 text-center">
        <Caption className="block">Shop</Caption>
        <H2 className="mt-4">The Collection</H2>
        <Lead className="mt-4">Carefully selected pieces</Lead>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Button size="lg" asChild>
          <Link href="/shop">Shop all</Link>
        </Button>
      </div>
    </Section>

  );
}