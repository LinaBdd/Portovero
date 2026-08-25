"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Container } from "../../components/ui/container";

import {
  fetchActiveCategories,
  type ApiCategory,
} from "../../lib/api/categories";

import { getImageUrl } from "../../lib/utils";

export default function CollectionsPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchActiveCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setError("Impossible de charger les collections.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">
      <Container>
        {/* Header */}
        <header className="pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="max-w-2xl">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B89B5E]">
              Portovero
            </p>

            <h1 className="font-heading text-5xl font-medium tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Collections
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#81786D] sm:text-base">
              Explore our carefully selected collections and discover pieces
              designed around timeless, effortless style.
            </p>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-[24px]"
              >
                <div className="aspect-[4/5] bg-[#EDE5DA]" />
                <div className="px-1 pt-5">
                  <div className="h-5 w-2/3 rounded bg-[#EDE5DA]" />
                  <div className="mt-3 h-3 w-5/6 rounded bg-[#EDE5DA]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="pb-24 pt-10">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="pb-24 pt-10">
            <p className="text-sm text-[#81786D]">
              No collections available.
            </p>
          </div>
        )}

        {/* Collections */}
        {!loading && !error && categories.length > 0 && (
          <section className="grid gap-x-8 gap-y-16 pb-28 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const imageUrl = getImageUrl(category.image);

              return (
                <Link
                  key={category.id}
                  href={`/collections/${category.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-[24px] bg-[#EDE5DA]">
                    <div className="aspect-[4/5]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={category.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#9B9184]">
                          No image
                        </div>
                      )}
                    </div>

                    {/* subtle overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent opacity-70" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                      <h2 className="font-heading text-2xl font-medium text-white sm:text-3xl">
                        {category.name}
                      </h2>

                      {category.description && (
                        <p className="mt-2 max-w-sm text-xs leading-5 text-white/80">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between px-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#81786D]">
                      Discover collection
                    </span>

                    <span className="text-sm text-[#172B3A] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </Container>
    </main>
  );
}