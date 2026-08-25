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

export interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
  is_active?: boolean;
}

export function fetchCategories() {
  return apiClient<{ total: number; items: ApiCategory[] }>("/categories/");
}

export function createCategory(data: CategoryPayload) {
  return apiClient<ApiCategory>("/categories/create", {
    method: "POST",
    body: data,
  });
}

export function deleteCategory(id: number) {
  return apiClient(`/categories/${id}`, { method: "DELETE" });
}