import { apiClient } from "./client";

export type CheckoutRequest = {
  user_id: number;
  address_id: number;
  shipping_method_id: number;
  payment_method: string;
  coupon_code?: string | null;
  notes?: string | null;
};

export async function createCheckout(
  data: CheckoutRequest
) {
  return apiClient("/checkout/", {
    method: "POST",
    body: data,
  });
}