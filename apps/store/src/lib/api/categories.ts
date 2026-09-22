import { API_URL } from "./config";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
};

/** Catégories actives, gérées depuis l'admin. Jamais mises en cache. */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories/active`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Category[];
  } catch {
    return [];
  }
}

/** Lien vers la boutique filtrée. Adapte ici si ta page shop utilise une autre route. */
export function categoryHref(slug: string) {
  return `/shop?category=${encodeURIComponent(slug)}`;
}

export function categoryImage(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}


/** Couleurs de secours (échantillons de tissu) pour les catégories sans image. */
export const FABRICS = [
  { bg: "#0F2D52", fg: "#f6f4ef" },
  { bg: "#b8a98c", fg: "#1d1d1a" },
  { bg: "#ddd5c3", fg: "#1d1d1a" },
  { bg: "#5b2a2e", fg: "#f6f4ef" },
  { bg: "#52634f", fg: "#f6f4ef" },
  { bg: "#2a2926", fg: "#f6f4ef" },
];

export const TWILL =
  "repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0 1px, transparent 1px 4px)";