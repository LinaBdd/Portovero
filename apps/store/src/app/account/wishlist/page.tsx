"use client";

import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { useWishlistStore } from "../../../store/wishlist";
import { ProductCard } from "../../../components/product";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const loading = useWishlistStore((state) => state.loading);
  const load = useWishlistStore((state) => state.load);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-px w-10 animate-pulse bg-[#B89B5E]" />

            <p className="text-[10px] uppercase tracking-[0.3em] text-[#81786D]">
              Portovero
            </p>

            <p className="mt-3 text-sm text-[#9A9186]">
              Loading your wishlist...
            </p>
          </div>
        </div>
      </main>
    );
  }

  const count = items.length;

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">

      {/* ─────────────────────────
          HEADER
      ───────────────────────── */}

      <section className="mx-auto max-w-[1500px] px-6 pb-16 pt-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-24">
        <div className="relative flex flex-col items-center text-center">

          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B89B5E]">
              Your selection
            </p>

            <h1 className="font-heading text-5xl font-medium leading-none tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Wishlist
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#81786D]">
              Pieces you've chosen to keep close.
            </p>
          </div>

          {count > 0 && (
            <div className="flex items-center gap-3 pb-1 text-sm text-[#81786D]">
              <Heart
                size={15}
                strokeWidth={1.4}
                className="text-[#B89B5E]"
              />

              <span>
                {count} {count === 1 ? "piece" : "pieces"} saved
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────
          CONTENT
      ───────────────────────── */}

      <section className="mx-auto max-w-[1500px] px-6 pb-28 sm:px-8 lg:px-12 lg:pb-36">

        {count === 0 ? (
          <EmptyWishlist />
        ) : (
          <div
            className="
              grid
              grid-cols-2
              gap-x-5
              gap-y-14
              sm:gap-x-7
              sm:gap-y-18
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


/* ─────────────────────────
   EMPTY WISHLIST
───────────────────────── */

function EmptyWishlist() {
  return (
    <div className="flex min-h-[52vh] flex-col items-center justify-center text-center">

      <div className="mb-9 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE5DA]">
        <Heart
          size={23}
          strokeWidth={1.2}
          className="text-[#B89B5E]"
        />
      </div>

      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B89B5E]">
        Your selection
      </p>

      <h2 className="font-heading text-3xl font-medium tracking-[-0.025em] sm:text-4xl">
        Nothing saved yet
      </h2>

      <p className="mt-5 max-w-sm text-sm leading-7 text-[#81786D]">
        Discover pieces you love and save them here for later.
      </p>

      <Link
        href="/shop"
        className="
          group
          mt-9
          inline-flex
          items-center
          gap-3
          rounded-full
          bg-[#172B3A]
          px-7
          py-3.5
          text-sm
          font-medium
          text-white
          transition-all
          duration-300
          hover:bg-[#243D4E]
        "
      >
        <span>Discover pieces</span>

        <ArrowRight
          size={16}
          strokeWidth={1.5}
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      </Link>
    </div>
  );
}