import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchFilteredProducts, adaptToListProduct } from "../../../lib/api/products";
import { ProductCard } from "../../../components/product";
import { heading } from "../../../lib/fonts";
import { API_URL } from "../../../lib/api/config";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${API_URL}/categories/slug/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return (await res.json()) as Category;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: `${category?.name ?? "Collection"} — Portovero` };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  const category = await getCategory(slug);
  if (!category) notFound();

  // Produits rattachés à cette catégorie (filtre par slug côté backend)
  let products: ReturnType<typeof adaptToListProduct>[] = [];
  try {
    const { items } = await fetchFilteredProducts(undefined, slug, 0, 100);
    products = items.map(adaptToListProduct);
  } catch {
    products = [];
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8A8176]"
        >
          <Link href="/" className="hover:text-[#172B3A]">Home</Link>
          <span className="text-[#B89B5E]">/</span>
          <Link href="/collections" className="hover:text-[#172B3A]">Collections</Link>
          <span className="text-[#B89B5E]">/</span>
          <span className="text-[#A69D91]">{category.name}</span>
        </nav>

        <div className="mb-14 max-w-2xl">
          <h1
            className={`${heading.className} text-5xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-6xl`}
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-5 text-[15px] leading-7 text-[#5F5D56]">
              {category.description}
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-[#172B3A]/10 bg-white/60 p-10 text-center text-sm text-[#81786D]">
            Aucun produit dans cette collection pour le moment.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}