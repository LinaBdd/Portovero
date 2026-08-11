"use client";

import Link from "next/link";
import { useWishlist } from "../../store/wishlist";
import { getDisplayPrice, getPrimaryImage } from "../../lib/product-helper";

export default function WishlistPage() {
  const items = useWishlist((state) => state.items);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-12 text-5xl font-serif">My Wishlist</h1>

      {items.length === 0 && <p>Your wishlist is empty.</p>}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => {
          const price = getDisplayPrice(product);
          const image = getPrimaryImage(product);

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="rounded-xl border p-4"
            >
              <img
                src={image}
                alt={product.name}
                className="aspect-square rounded-lg object-cover"
              />

              <h2 className="mt-4 text-lg font-semibold">
                {product.name}
              </h2>

              <p>{price.toLocaleString("fr-FR")} DA</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}