"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { Button } from "../../components/ui/button";
import { CartItem } from "../../components/cart/CartItem";
import { CartSummary } from "../../components/cart/CartSummary";
import { useCart } from "../../store/cart";

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">
        <div className="mx-auto flex min-h-[70vh] max-w-[900px] items-center justify-center px-6 py-24">
          <div className="w-full text-center">

            {/* Icon */}
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE5DA]">
              <ShoppingBag
                size={24}
                strokeWidth={1.4}
                className="text-[#172B3A]"
              />
            </div>

            {/* Eyebrow */}
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B89B5E]">
              Portovero
            </p>

            <h1 className="font-heading text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
              Votre panier est vide
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#81786D]">
              Découvrez notre sélection de pièces intemporelles et trouvez
              celles qui correspondent à votre style.
            </p>

            <Link href="/shop" className="mt-9 inline-block">
              <Button
                variant="primary"
                className="h-12 rounded-full bg-[#172B3A] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#243D4F] hover:shadow-lg"
              >
                Découvrir la collection
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">

      {/* Header */}
      <section className="mx-auto max-w-[1400px] px-6 pb-10 pt-12 sm:px-8 lg:px-12 lg:pt-16">

        <Link
          href="/shop"
          className="group mb-8 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#81786D] transition-colors hover:text-[#172B3A]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Continuer mes achats
        </Link>

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B89B5E]">
              Your selection
            </p>

            <h1 className="font-heading text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Votre panier
            </h1>
          </div>

          <p className="hidden pb-1 text-sm text-[#81786D] sm:block">
            {items.length}{" "}
            {items.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      {/* Cart */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 sm:px-8 lg:px-12 lg:pb-32">

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-20">

          {/* Items */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#172B3A]">
                Articles sélectionnés
              </p>

              <span className="text-xs text-[#81786D] sm:hidden">
                {items.length}{" "}
                {items.length === 1 ? "article" : "articles"}
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="rounded-2xl bg-[#FFFCF7] p-3 shadow-[0_4px_24px_rgba(23,43,58,0.035)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(23,43,58,0.06)] sm:p-4"
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl bg-[#EDE5DA] p-6 sm:p-7">

              <div className="mb-7">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B89B5E]">
                  Order summary
                </p>

                <h2 className="mt-2 font-heading text-2xl font-medium text-[#172B3A]">
                  Votre commande
                </h2>
              </div>

              <CartSummary />
            </div>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-[#81786D]">
              Une expérience simple et soigneusement pensée,
              de la sélection à la livraison.
            </p>
          </aside>

        </div>
      </section>
    </main>
  );
}