import Link from "next/link";

import { heading } from "../../lib/fonts";
import { API_URL } from "../../lib/api/config";

export const metadata = { title: "Collections — Portovero" };
export const dynamic = "force-dynamic"; // toujours à jour avec l'admin

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories/active`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Category[];
  } catch {
    return [];
  }
}

function imageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Couleurs de secours (échantillons de tissu) pour les catégories sans image.
const FABRICS = ["#0F2D52", "#B8A98C", "#5B2A2E", "#52634F", "#2A2926", "#8F8064"];
const TWILL =
  "repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0 1px, transparent 1px 4px)";

// 1 catégorie : grande carte · 2 : deux colonnes · 3+ : trois colonnes
function gridClass(n: number) {
  if (n <= 1) return "grid-cols-1";
  if (n === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

export default async function CollectionsPage() {
  const categories = await getCategories();
  const single = categories.length === 1;

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#B89B5E]">
            Collections
          </p>
          <h1
            className={`${heading.className} text-5xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-6xl`}
          >
            Curated for a timeless wardrobe.
          </h1>
        </div>

        {categories.length === 0 ? (
          <p className="rounded-2xl border border-[#172B3A]/10 bg-white/60 p-10 text-center text-sm text-[#81786D]">
            Les collections arrivent bientôt.
          </p>
        ) : (
          <div className={`grid gap-6 ${gridClass(categories.length)}`}>
            {categories.map((category, i) => {
              const img = imageUrl(category.image);
              const fabric = FABRICS[i % FABRICS.length];

              return (
                <Link
                  key={category.id}
                  href={`/collections/${category.slug}`}
                  className="group block"
                >
                  <div
                    className={`relative overflow-hidden rounded-[28px] ${
                      single ? "aspect-[16/9]" : "aspect-[4/5]"
                    }`}
                    style={{
                      backgroundColor: fabric,
                      backgroundImage: img ? undefined : TWILL,
                    }}
                  >
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={category.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                      <h2
                        className={`${heading.className} text-3xl font-medium sm:text-4xl`}
                      >
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between px-1">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#81786D]">
                      Découvrir
                    </span>
                    <span className="text-[#172B3A] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}