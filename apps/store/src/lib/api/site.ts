import { API_URL } from "./config";
import { categoryImage, getCategories, type Category } from "./categories";

/** Contenu éditorial du site, géré depuis l'admin (Paramètres, Contenu, Bannières). */

export type SiteSettings = Record<string, string>;

export type ContentType =
  | "faq"
  | "testimonial"
  | "feature"
  | "value"
  | "instagram";

export interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  subtitle: string | null;
  text: string | null;
  image: string | null;
  link: string | null;
  icon: string | null;
  rating: number | null;
  position: number;
  is_active: boolean;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  position: number;
  is_active: boolean;
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function getSettings(): Promise<SiteSettings> {
  return getJson<SiteSettings>("/site/settings", {});
}

export function getContent(type: ContentType): Promise<ContentItem[]> {
  return getJson<ContentItem[]>(`/site/content?type=${type}`, []);
}

export function getBanners(): Promise<Banner[]> {
  return getJson<Banner[]>("/banners/active", []);
}

export { getCategories, categoryImage };
export type { Category };

/** Image gérée par l'admin : chemin d'upload, URL absolue ou fichier statique du store. */
export function mediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("/uploads/")) return `${API_URL}${path}`;
  return path.startsWith("/") ? path : `/${path}`;
}

/** Remplace {year} dans un texte éditable. */
export function withYear(text?: string): string {
  return (text ?? "").replace("{year}", String(new Date().getFullYear()));
}

/** Paragraphes séparés par une ligne vide. */
export function paragraphs(text: string | undefined): string[] {
  return (text ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function sendContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const res = await fetch(`${API_URL}/site/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("contact_failed");
}

export async function subscribeNewsletter(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/newsletter/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("newsletter_failed");
}
