"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Section } from "../../components/ui/section";
import { H1, Lead } from "../../components/ui/typography";

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
    <Section>
      <div className="mb-16 text-center">
        <H1>Collections</H1>

        <Lead>
          Explore our curated luxury collections.
        </Lead>
      </div>

      {loading && (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-3xl bg-neutral-100"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="py-20 text-center">
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm text-neutral-500">
            No collections available.
          </p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const imageUrl = getImageUrl(category.image);

            return (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className="group overflow-hidden rounded-3xl border"
              >
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-serif">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="mt-2 text-sm text-neutral-500">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
