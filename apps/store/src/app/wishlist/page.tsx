"use client";

import { useWishlist } from "../../store/wishlist";

export default function WishlistPage() {

  const items = useWishlist((state) => state.items);

  return (

    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="mb-12 text-5xl font-serif">
        My Wishlist
      </h1>

      {items.length === 0 && (

        <p>
          Your wishlist is empty.
        </p>

      )}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {items.map((product) => (

          <div
            key={product.id}
            className="rounded-xl border p-4"
          >

            <img
              src={product.images[0]}
              alt={product.name}
              className="aspect-square rounded-lg object-cover"
            />

            <h2 className="mt-4 text-lg font-semibold">
              {product.name}
            </h2>

            <p>
              {product.price.toLocaleString("fr-FR")} DA
            </p>

          </div>

        ))}

      </div>

    </main>

  );

}