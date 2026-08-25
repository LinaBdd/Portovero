import { apiClient } from "./client";

export interface ApiShippingMethod {
  id: number;
  name: string;
  description: string | null;
  estimated_days: number;
  base_price: string;
  is_active: boolean;
}

export function fetchShippingMethods() {
  return apiClient<ApiShippingMethod[]>("/shipping-methods/");
}

export interface ApiShippingRate {
  id: number;
  wilaya_id: number;
  shipping_method_id: number;
  price: string;
  is_active: boolean;
}

export function fetchShippingRates(wilayaId: number) {
  return apiClient<ApiShippingRate[]>(
    `/shipping-rates/wilaya/${wilayaId}`
  );
}