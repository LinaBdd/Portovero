"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Product,
  ProductColor,
  ProductVariant,
} from "../types/product";

export interface CartItem {
  product: Product;
  color: ProductColor;
  variant: ProductVariant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  add: (
    product: Product,
    color: ProductColor,
    variant: ProductVariant,
    quantity?: number
  ) => void;

  remove: (itemId: string) => void;

  increase: (itemId: string) => void;

  decrease: (itemId: string) => void;

  clear: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      // =========================
      // ADD
      // =========================

      add: (
        product,
        color,
        variant,
        quantity = 1
      ) =>
        set((state) => {
          const itemId = `${product.id}-${variant.id}`;

          const existing = state.items.find(
            (item) =>
              `${item.product.id}-${item.variant.id}` ===
              itemId
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                `${item.product.id}-${item.variant.id}` ===
                itemId
                  ? {
                      ...item,
                      quantity:
                        item.quantity + quantity,
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
                color,
                variant,
                quantity,
              },
            ],
          };
        }),

      // =========================
      // REMOVE
      // =========================

      remove: (itemId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              `${item.product.id}-${item.variant.id}` !==
              itemId
          ),
        })),

      // =========================
      // INCREASE
      // =========================

      increase: (itemId) =>
        set((state) => ({
          items: state.items.map((item) => {
            const currentId = `${item.product.id}-${item.variant.id}`;

            if (currentId !== itemId) {
              return item;
            }

            if (item.quantity >= item.variant.stock) {
              return item;
            }

            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }),
        })),

      // =========================
      // DECREASE
      // =========================

      decrease: (itemId) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              const currentId = `${item.product.id}-${item.variant.id}`;

              if (currentId !== itemId) {
                return item;
              }

              return {
                ...item,
                quantity: item.quantity - 1,
              };
            })
            .filter(
              (item) => item.quantity > 0
            ),
        })),

      // =========================
      // CLEAR
      // =========================

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