"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product, ProductColor, ProductVariant } from "../types/product";
import { useAuth } from "./auth";
import { addToCart, updateCartItem, removeCartItem, clearCart } from "../lib/api/cart";

export interface CartItem {
  product: Product;
  color: ProductColor;
  variant: ProductVariant;
  quantity: number;
  /** id de la ligne cart_items côté backend, une fois synchronisée */
  cartItemId?: number;
}

interface CartStore {
  items: CartItem[];

  add: (
    product: Product,
    color: ProductColor,
    variant: ProductVariant,
    quantity?: number
  ) => Promise<void>;

  remove: (itemId: string) => Promise<void>;
  increase: (itemId: string) => Promise<void>;
  decrease: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

function itemKey(productId: string, variantId: number) {
  return `${productId}-${variantId}`;
}

function currentUserId(): number | null {
  return useAuth.getState().user?.id ?? null;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // =========================
      // ADD
      // =========================
      add: async (product, color, variant, quantity = 1) => {
        const key = itemKey(product.id, variant.id);
        const existing = get().items.find(
          (item) => itemKey(item.product.id, item.variant.id) === key
        );

        // Mise à jour optimiste locale
        set((state) => {
          if (existing) {
            return {
              items: state.items.map((item) =>
                itemKey(item.product.id, item.variant.id) === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { product, color, variant, quantity }],
          };
        });

        // Sync backend (best-effort, non bloquant pour l'UX)
        const userId = currentUserId();
        if (!userId) return; // invité : reste local uniquement

        try {
          const backendItem = await addToCart(userId, variant.id, quantity);
          set((state) => ({
            items: state.items.map((item) =>
              itemKey(item.product.id, item.variant.id) === key
                ? { ...item, cartItemId: backendItem.id, quantity: backendItem.quantity }
                : item
            ),
          }));
        } catch (err) {
          console.error("Cart sync (add) failed:", err);
        }
      },

      // =========================
      // REMOVE
      // =========================
      remove: async (itemId) => {
        const target = get().items.find(
          (item) => itemKey(item.product.id, item.variant.id) === itemId
        );

        set((state) => ({
          items: state.items.filter(
            (item) => itemKey(item.product.id, item.variant.id) !== itemId
          ),
        }));

        if (target?.cartItemId) {
          try {
            await removeCartItem(target.cartItemId);
          } catch (err) {
            console.error("Cart sync (remove) failed:", err);
          }
        }
      },

      // =========================
      // INCREASE
      // =========================
      increase: async (itemId) => {
        let newQuantity: number | null = null;
        let cartItemId: number | undefined;

        set((state) => ({
          items: state.items.map((item) => {
            if (itemKey(item.product.id, item.variant.id) !== itemId) return item;
            if (item.quantity >= item.variant.stock) return item;

            newQuantity = item.quantity + 1;
            cartItemId = item.cartItemId;
            return { ...item, quantity: newQuantity };
          }),
        }));

        if (cartItemId && newQuantity !== null) {
          try {
            await updateCartItem(cartItemId, newQuantity);
          } catch (err) {
            console.error("Cart sync (increase) failed:", err);
          }
        }
      },

      // =========================
      // DECREASE
      // =========================
      decrease: async (itemId) => {
        let newQuantity: number | null = null;
        let cartItemId: number | undefined;
        let shouldRemove = false;

        set((state) => ({
          items: state.items
            .map((item) => {
              if (itemKey(item.product.id, item.variant.id) !== itemId) return item;

              newQuantity = item.quantity - 1;
              cartItemId = item.cartItemId;
              if (newQuantity <= 0) shouldRemove = true;

              return { ...item, quantity: newQuantity };
            })
            .filter((item) => item.quantity > 0),
        }));

        if (!cartItemId) return;

        try {
          if (shouldRemove) {
            await removeCartItem(cartItemId);
          } else if (newQuantity !== null) {
            await updateCartItem(cartItemId, newQuantity);
          }
        } catch (err) {
          console.error("Cart sync (decrease) failed:", err);
        }
      },

      // =========================
      // CLEAR
      // =========================
      clear: async () => {
        set({ items: [] });

        const userId = currentUserId();
        if (!userId) return;

        try {
          await clearCart(userId);
        } catch (err) {
          console.error("Cart sync (clear) failed:", err);
        }
      },
    }),
    {
      name: "portovero-cart",
    }
  )
);