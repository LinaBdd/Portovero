"use client";

import { useEffect, useState } from "react";

import { Checkbox } from "../ui/checkbox";

import {
  fetchCategories,
  type Category,
} from "../../lib/api/products";

export interface ShopFilters {
  gender: string[];
  category: string[];
}

interface FilterSidebarProps {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
}

export function FilterSidebar({
  filters,
  onChange,
}: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  // ============================================================
  // LOAD CATEGORIES FROM BACKEND
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const data = await fetchCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );

        if (!cancelled) {
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // TOGGLE FILTER
  // ============================================================

  const toggleFilter = (
    type: "gender" | "category",
    value: string
  ) => {
    const current = filters[type] ?? [];

    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    onChange({
      ...filters,
      [type]: updated,
    });
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    onChange({
      gender: [],
      category: [],
    });
  };

  const hasFilters =
    filters.gender.length > 0 ||
    filters.category.length > 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-10">

      {/* =========================
          FILTER HEADER
      ========================== */}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em]">
          Filters
        </h2>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-neutral-500 underline underline-offset-4 transition hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      {/* =========================
          GENDER
      ========================== */}

      <div>
        <h3 className="mb-4 text-sm font-semibold">
          Gender
        </h3>

        <div className="space-y-3">
          <Checkbox
            label="Men"
            checked={filters.gender.includes("men")}
            onChange={() =>
              toggleFilter("gender", "men")
            }
          />

          <Checkbox
            label="Women"
            checked={filters.gender.includes("women")}
            onChange={() =>
              toggleFilter("gender", "women")
            }
          />
        </div>
      </div>

      {/* =========================
          CATEGORY
      ========================== */}

      <div>
        <h3 className="mb-4 text-sm font-semibold">
          Category
        </h3>

        <div className="space-y-3">
          {loadingCategories ? (
            <div className="space-y-3">
              <div className="h-5 w-24 animate-pulse bg-neutral-100" />
              <div className="h-5 w-28 animate-pulse bg-neutral-100" />
              <div className="h-5 w-20 animate-pulse bg-neutral-100" />
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <Checkbox
                key={category.id}
                label={category.name}
                checked={filters.category.includes(
                  category.slug
                )}
                onChange={() =>
                  toggleFilter(
                    "category",
                    category.slug
                  )
                }
              />
            ))
          ) : (
            <p className="text-sm text-neutral-400">
              No categories available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}