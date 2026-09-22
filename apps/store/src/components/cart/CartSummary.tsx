"use client";

import Link from "next/link";

import { useCart } from "../../store/cart";

export function CartSummary() {
  const { items } = useCart();

  const subtotal = items.reduce(
    (total, item) => {
      const price =
        item.variant.price !== null &&
        item.variant.price !== undefined
          ? Number(item.variant.price)
          : Number(item.product.base_price);

      return total + price * item.quantity;
    },
    0
  );

  // Les frais réels dépendent de la wilaya : ils sont calculés au checkout.
  const total = subtotal;

  return (
    <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-3xl font-serif">
        Résumé de la commande
      </h2>

      <div className="space-y-5">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-neutral-600">
            Sous-total
          </span>

          <span className="font-medium">
            {subtotal.toLocaleString("fr-DZ")} DA
          </span>
        </div>

        {/* Delivery */}
        <div className="flex justify-between">
          <span className="text-neutral-600">
            Livraison
          </span>

          <span className="text-sm text-neutral-500">
            Calculée à la commande
          </span>
        </div>

        <hr />

        {/* Total */}
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>
            {total.toLocaleString("fr-DZ")} DA
          </span>
        </div>

        {/* Checkout */}
        <Link
          href="/checkout"
          className="
            mt-6
            flex
            h-14
            items-center
            justify-center
            rounded-full
            bg-[#0F2D52]
            text-white
            transition
            hover:bg-[#173F73]
          "
        >
          Passer la commande
        </Link>

        {/* Continue shopping */}
        <Link
          href="/shop"
          className="
            block
            text-center
            text-sm
            text-neutral-500
            transition
            hover:text-black
          "
        >
          Continuer mes achats
        </Link>
      </div>
    </aside>
  );
}