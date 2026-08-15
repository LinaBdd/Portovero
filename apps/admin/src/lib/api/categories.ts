import { apiClient } from "./client";

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}

export function fetchCategories() {
  return apiClient<{ total: number; items: ApiCategory[] }>("/categories/");
}

export function createCategory(data: { name: string; description?: string | null }) {
  return apiClient<ApiCategory>("/categories/create", {
    method: "POST",
    body: { ...data, is_active: true },
  });
}

export function deleteCategory(id: number) {
  return apiClient(`/categories/${id}`, { method: "DELETE" });
}