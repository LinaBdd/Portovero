import { apiClient } from "./client";

export interface CartItemRead {
  id: number;
  user_id: number;
  product_variant_id: number;
  quantity: number;
}

export function addToCart(userId: number, productVariantId: number, quantity: number) {
  return apiClient<CartItemRead>(`/cart/${userId}`, {
    method: "POST",
    body: { product_variant_id: productVariantId, quantity },
  });
}

export function updateCartItem(cartItemId: number, quantity: number) {
  return apiClient<CartItemRead>(`/cart/${cartItemId}`, {
    method: "PUT",
    body: { quantity },
  });
}

export function removeCartItem(cartItemId: number) {
  return apiClient(`/cart/${cartItemId}`, {
    method: "DELETE",
  });
}

export function clearCart(userId: number) {
  return apiClient(`/cart/clear/${userId}`, {
    method: "DELETE",
  });
}

export function getCart(userId: number) {
  return apiClient<CartItemRead[]>(`/cart/${userId}`);
}