"use client";

import { Heart } from "lucide-react";
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
      <main className="container mx-auto px-6 py-20">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-neutral-500">
            Loading your wishlist...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <Heart className="h-7 w-7" />
          <h1 className="text-3xl font-medium">
            My Wishlist
          </h1>
        </div>

        <p className="text-sm text-neutral-500">
          {items.length}{" "}
          {items.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Heart className="mb-6 h-12 w-12 text-neutral-300" />

          <h2 className="mb-2 text-xl font-medium">
            Your wishlist is empty
          </h2>

          <p className="mb-8 max-w-md text-sm text-neutral-500">
            Save your favorite products and they will
            appear here.
          </p>

          <Link
            href="/shop"
            className="
              rounded-full
              bg-black
              px-6
              py-3
              text-sm
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            Discover products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}