"use client";

import { useEffect, useState } from "react";

import { ProductCard } from "../../components/product/ProductCard";
import { searchProductsForStore } from "../../lib/api/products";
import { Product } from "../../types/product";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      setLoading(true);

      const products = await searchProductsForStore(query);

      if (!cancelled) {
        setResults(products);
        setLoading(false);
      }
    }

    const timeout = setTimeout(runSearch, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
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
        {loading ? "Searching..." : `${results.length} product(s) found`}
      </p>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {results.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {!loading && results.length === 0 && (
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
