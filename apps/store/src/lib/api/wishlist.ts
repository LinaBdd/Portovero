import { apiClient } from "./client";

export interface ApiWishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
}

export function fetchWishlist() {
  return apiClient<ApiWishlistItem[]>("/wishlist/");
}

export function addToWishlist(productId: number) {
  return apiClient<ApiWishlistItem>(
    `/wishlist/${productId}`,
    {
      method: "POST",
    }
  );
}

export function removeFromWishlist(productId: number) {
  return apiClient(
    `/wishlist/${productId}`,
    {
      method: "DELETE",
    }
  );
}