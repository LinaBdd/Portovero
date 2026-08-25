import { apiClient } from "./client";

export interface Color {
  id: number;
  name: string;
  hex_code: string;
  created_at: string;
}

export interface ColorListResponse {
  total: number;
  items: Color[];
}

export interface ColorCreate {
  name: string;
  hex_code: string;
}

export interface ColorUpdate {
  name?: string;
  hex_code?: string;
}

export async function fetchColors(): Promise<ColorListResponse> {
  return apiClient<ColorListResponse>("/colors/", {
    method: "GET",
    auth: true,
  });
}

export async function createColor(
  data: ColorCreate
): Promise<Color> {
  return apiClient<Color>("/colors/create", {
    method: "POST",
    auth: true,
    body: data,
  });
}

export async function updateColor(
  id: number,
  data: ColorUpdate
): Promise<Color> {
  return apiClient<Color>(`/colors/${id}`, {
    method: "PUT",
    auth: true,
    body: data,
  });
}

export async function deleteColor(id: number): Promise<void> {
  return apiClient<void>(`/colors/${id}`, {
    method: "DELETE",
    auth: true,
  });
}