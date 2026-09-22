import { apiClient, uploadFile } from "./client";
import { API_URL as BASE_URL } from "./config";

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

export type ContentPayload = Omit<ContentItem, "id">;

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

export type BannerPayload = Omit<Banner, "id">;

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Subscriber {
  id: number;
  email: string | null;
  phone: string | null;
  subscribed: boolean;
  created_at: string;
}

/** URL affichable d'une image stockée (chemin d'upload ou URL absolue). */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function uploadImage(file: File): Promise<string> {
  const res = await uploadFile<{ url: string }>("/admin/upload/image", file);
  return res.url;
}

// ---------- Paramètres ----------

export const fetchSettings = () =>
  apiClient<Record<string, string>>("/site/settings", { auth: false });

export const saveSettings = (settings: Record<string, string>) =>
  apiClient<Record<string, string>>("/site/settings", {
    method: "PUT",
    body: { settings },
  });

// ---------- Contenu ----------

export const fetchContent = (type: ContentType) =>
  apiClient<ContentItem[]>(`/site/content/all?type=${type}`);

export const createContent = (data: ContentPayload) =>
  apiClient<ContentItem>("/site/content", { method: "POST", body: data });

export const updateContent = (id: number, data: Partial<ContentPayload>) =>
  apiClient<ContentItem>(`/site/content/${id}`, { method: "PUT", body: data });

export const deleteContent = (id: number) =>
  apiClient(`/site/content/${id}`, { method: "DELETE" });

// ---------- Bannières ----------

export const fetchBanners = () => apiClient<Banner[]>("/banners/");

export const createBanner = (data: BannerPayload) =>
  apiClient<Banner>("/banners/create", { method: "POST", body: data });

export const updateBanner = (id: number, data: Partial<BannerPayload>) =>
  apiClient<Banner>(`/banners/${id}`, { method: "PUT", body: data });

export const deleteBanner = (id: number) =>
  apiClient(`/banners/${id}`, { method: "DELETE" });

// ---------- Messages & newsletter ----------

export const fetchMessages = () =>
  apiClient<ContactMessage[]>("/site/contact");

export const markMessage = (id: number, isRead: boolean) =>
  apiClient<ContactMessage>(`/site/contact/${id}/read?is_read=${isRead}`, {
    method: "PUT",
  });

export const deleteMessage = (id: number) =>
  apiClient(`/site/contact/${id}`, { method: "DELETE" });

export const fetchSubscribers = () => apiClient<Subscriber[]>("/newsletter/");
