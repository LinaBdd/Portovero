"use client";

import Link from "next/link";

import { Button } from "../../components/ui/button";
import { CartItem } from "../../components/cart/CartItem";
import { CartSummary } from "../../components/cart/CartSummary";
import { useCart } from "../../store/cart";

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="mb-4 text-5xl font-serif">
          Votre panier
        </h1>

        <p className="mb-8 text-neutral-500">
          Votre panier est actuellement vide.
        </p>

        <Link href="/shop">
          <Button variant="primary">
            Continuer mes achats
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="mb-12 text-5xl font-serif">
        Votre panier
      </h1>

      <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
        {/* =========================
            CART ITEMS
        ========================== */}

        <div className="space-y-6">
          {items.map((item) => (
            <CartItem
              key={`${item.product.id}-${item.variant.id}`}
              item={item}
            />
          ))}
        </div>

        {/* =========================
            SUMMARY
        ========================== */}

        <CartSummary />
      </div>
    </main>
  );
}