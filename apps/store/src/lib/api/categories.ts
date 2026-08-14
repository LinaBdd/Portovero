import { apiClient } from "./client";

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function fetchActiveCategories() {
  return apiClient<ApiCategory[]>("/categories/active");
}

export function fetchCategoryBySlug(slug: string) {
  return apiClient<ApiCategory>(
    `/categories/slug/${encodeURIComponent(slug)}`
  );
}