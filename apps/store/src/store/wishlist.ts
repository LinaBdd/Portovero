"use client";

import { create } from "zustand";

import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../lib/api/wishlist";

import { Product } from "../types/product";
import { adaptToListProduct, fetchProductList } from "../lib/api/products";

interface WishlistState {
  items: Product[];
  loading: boolean;

  load: () => Promise<void>;

  add: (product: Product) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  toggle: (product: Product) => Promise<void>;

  contains: (productId: string) => boolean;

  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,

  load: async () => {
  set({ loading: true });

  try {
    const wishlistItems = await fetchWishlist();

    const wishlistProductIds = new Set(
      wishlistItems.map((item) =>
        String(item.product_id)
      )
    );

    const response = await fetchProductList(0, 100);

    const allProducts = response.items.map(
      adaptToListProduct
    );

    const products = allProducts.filter((product) =>
      wishlistProductIds.has(String(product.id))
    );

    set({
      items: products,
      loading: false,
    });
  } catch (error) {
    console.error(
      "[wishlist] Failed to load:",
      error
    );

    set({
      items: [],
      loading: false,
    });
  }
},

  add: async (product) => {
    try {
      await addToWishlist(Number(product.id));

      set((state) => {
        if (
          state.items.some(
            (item) => item.id === product.id
          )
        ) {
          return state;
        }

        return {
          items: [...state.items, product],
        };
      });
    } catch (error) {
      console.error("[wishlist] Failed to add:", error);
    }
  },

  remove: async (productId) => {
    try {
      await removeFromWishlist(Number(productId));

      set((state) => ({
        items: state.items.filter(
          (item) => item.id !== productId
        ),
      }));
    } catch (error) {
      console.error("[wishlist] Failed to remove:", error);
    }
  },

  toggle: async (product) => {
    const exists = get().contains(product.id);

    if (exists) {
      await get().remove(product.id);
    } else {
      await get().add(product);
    }
  },

  contains: (productId) => {
    return get().items.some(
      (item) => item.id === productId
    );
  },

  clear: () => {
    set({ items: [] });
  },
}));