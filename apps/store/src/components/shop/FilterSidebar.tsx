"use client";

import { Checkbox } from "../ui/checkbox";

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

  const clearFilters = () => {
    onChange({
      gender: [],
      category: [],
    });
  };

  const hasFilters =
    filters.gender.length > 0 ||
    filters.category.length > 0;

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
          <Checkbox
            label="Shirts"
            checked={filters.category.includes("shirts")}
            onChange={() =>
              toggleFilter("category", "shirts")
            }
          />

          <Checkbox
            label="Pants"
            checked={filters.category.includes("pants")}
            onChange={() =>
              toggleFilter("category", "pants")
            }
          />

          <Checkbox
            label="Jackets"
            checked={filters.category.includes("jackets")}
            onChange={() =>
              toggleFilter("category", "jackets")
            }
          />
        </div>
      </div>

    </div>
  );
}