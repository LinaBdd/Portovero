"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type GuestWishlistItem = {
  id: string | number;
  slug: string;
  name: string;
  image?: string | null;
};

type GuestWishlistState = {
  items: GuestWishlistItem[];

  add: (product: GuestWishlistItem) => void;
  remove: (productId: string | number) => void;
  toggle: (product: GuestWishlistItem) => void;
  has: (productId: string | number) => boolean;
  clear: () => void;
};

export const useWishlistGuest = create<GuestWishlistState>()(
  persist<GuestWishlistState>(
    (set, get) => ({
      items: [],

      add: (product) => {
        const exists = get().items.some(
          (item) => String(item.id) === String(product.id)
        );

        if (exists) return;

        set((state) => ({
          items: [...state.items, product],
        }));
      },

      remove: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => String(item.id) !== String(productId)
          ),
        }));
      },

      toggle: (product) => {
        if (get().has(product.id)) {
          get().remove(product.id);
        } else {
          get().add(product);
        }
      },

      has: (productId) => {
        return get().items.some(
          (item) => String(item.id) === String(productId)
        );
      },

      clear: () => {
        set({ items: [] });
      },
    }),
    {
      name: "portovero-wishlist-guest",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);