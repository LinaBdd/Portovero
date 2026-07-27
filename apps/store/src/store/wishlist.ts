"use client";

import { create } from "zustand";
import { Product } from "../types/product";

interface WishlistStore {
  items: Product[];

  add: (product: Product) => void;

  remove: (id: string) => void;

  toggle: (product: Product) => void;

  contains: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>((set, get) => ({

  items: [],

  add: (product) =>
    set((state) => ({
      items: [...state.items, product],
    })),

  remove: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  toggle: (product) => {

    const exists = get().items.some(
      (item) => item.id === product.id
    );

    if (exists) {
      get().remove(product.id);
    } else {
      get().add(product);
    }

  },

  contains: (id) => {

    return get().items.some(
      (item) => item.id === id
    );

  },

}));