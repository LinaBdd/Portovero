"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Product } from "../types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  add: (product: Product, quantity?: number) => void;

  remove: (id: string) => void;

  increase: (id: string) => void;

  decrease: (id: string) => void;

  clear: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
              },
            ],
          };
        }),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.id !== id
          ),
        })),

      increase: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        })),

      decrease: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clear: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "portovero-cart",
    }
  )
);