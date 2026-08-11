"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  fetchProductList,
  fetchFilteredProducts,
  adaptToListProduct,
} from "../../lib/api/products";

import type { Product } from "../../types/product";
import type { ShopFilters } from "./FilterSidebar";

interface ProductGridProps {
  search: string;
  sort: string;
  filters: ShopFilters;
}

export function ProductGrid({
  search,
  sort,
  filters,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        let response;

        // ============================
        // BACKEND FILTER
        // ============================

        if (filters.gender.length > 0) {
          response = await fetchFilteredProducts(
            filters.gender[0],
            0,
            100
          );
        } else {
          response = await fetchProductList(0, 100);
        }

        const adaptedProducts = response.items.map(
          adaptToListProduct
        );

        setProducts(adaptedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [filters.gender]);

  // ============================
  // SEARCH
  // ============================

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  // ============================
  // SORT
  // ============================

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {
      switch (sort) {
        case "price_asc":
          return a.base_price - b.base_price;

        case "price_desc":
          return b.base_price - a.base_price;

        case "newest":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );

        default:
          return 0;
      }
    }
  );

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] animate-pulse bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  // ============================
  // EMPTY
  // ============================

  if (sortedProducts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-neutral-500">
          No products found.
        </p>
      </div>
    );
  }

  // ============================
  // PRODUCTS
  // ============================

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {sortedProducts.map((product) => {
        const image = product.images?.[0];

        return (
          <article
            key={product.id}
            className="group"
          >
            {/* IMAGE */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  No image
                </div>
              )}

              {/* NEW BADGE */}
              {product.is_new && (
                <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs tracking-wide">
                  New
                </span>
              )}
            </div>

            {/* INFO */}
            <div className="mt-4">
              <h3 className="font-serif text-lg">
                {product.name}
              </h3>

              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm">
                  {product.base_price} DA
                </span>

                {product.compare_at_price &&
                  product.compare_at_price >
                    product.base_price && (
                    <span className="text-sm text-neutral-400 line-through">
                      {product.compare_at_price} DA
                    </span>
                  )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}