import { apiClient } from "./client";

export interface Size {
  id: number;
  name: string;
  display_order: number;
  created_at: string;
}

export interface SizeListResponse {
  total: number;
  items: Size[];
}

export interface SizeCreate {
  name: string;
  display_order: number;
}

export interface SizeUpdate {
  name?: string;
  display_order?: number;
}

export async function fetchSizes(): Promise<SizeListResponse> {
  return apiClient<SizeListResponse>("/sizes/", {
    method: "GET",
    auth: true,
  });
}

export async function createSize(
  data: SizeCreate
): Promise<Size> {
  return apiClient<Size>("/sizes/create", {
    method: "POST",
    auth: true,
    body: data,
  });
}

export async function updateSize(
  id: number,
  data: SizeUpdate
): Promise<Size> {
  return apiClient<Size>(`/sizes/${id}`, {
    method: "PUT",
    auth: true,
    body: data,
  });
}

export async function deleteSize(id: number): Promise<void> {
  return apiClient<void>(`/sizes/${id}`, {
    method: "DELETE",
    auth: true,
  });
}