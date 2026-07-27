"use client";

import { useMemo, useState } from "react";

import { products } from "../../data/products";
import { ProductCard } from "../../components/product/ProductCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const value = query.toLowerCase().trim();

    if (!value) return products;

    return products.filter((product) =>
      product.name.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value) ||
      product.gender.toLowerCase().includes(value) ||
      product.description.toLowerCase().includes(value) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(value)
      )
    );
  }, [query]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <h1 className="mb-8 font-serif text-5xl">
        Search
      </h1>

      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-10 w-full rounded-2xl border bg-white p-4 text-lg outline-none focus:border-[#0F2D52]"
      />

      <p className="mb-8 text-neutral-500">
        {filteredProducts.length} product(s) found
      </p>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-20 text-center text-neutral-500">
          <h2 className="mb-3 text-2xl font-semibold">
            No products found
          </h2>

          <p>
            Try another search.
          </p>
        </div>
      )}

    </main>
  );
}