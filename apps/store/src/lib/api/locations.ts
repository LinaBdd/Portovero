import { apiClient } from "./client";

export interface ApiWilaya {
  id: number;
  code: number;
  name: string;
  home_shipping_price: string;
  stopdesk_shipping_price: string;
  is_active: boolean;
}

export interface ApiCommune {
  id: number;
  wilaya_id: number;
  name: string;
  postal_code: string | null;
}

export function fetchWilayas() {
  return apiClient<ApiWilaya[]>("/wilayas/");
}

export function fetchCommunesByWilaya(wilayaId: number) {
  return apiClient<ApiCommune[]>(`/communes/wilaya/${wilayaId}`);
}