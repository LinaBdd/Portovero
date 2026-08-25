"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

import {
  FilterSidebar,
  type ShopFilters,
} from "../../components/shop/FilterSidebar";
import { ProductGrid } from "../../components/shop/ProductGrid";
import { SearchBar } from "../../components/shop/SearchBar";
import { SortSelect } from "../../components/shop/SortSelect";

export type SortOption =
  | "newest"
  | "best_sellers"
  | "highest_rated"
  | "price_asc"
  | "price_desc";

const DEFAULT_FILTERS: ShopFilters = {
  gender: [],
  category: [],
};

function formatFilterLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
}

export default function ShopPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleSortChange = (value: string) => {
    setSortValue(value as SortOption);
  };

  const handleFilterChange = (newFilters: ShopFilters) => {
    setFilters(newFilters);
  };

  const activeChips = [
    ...filters.gender.map((v) => ({ type: "gender" as const, value: v })),
    ...filters.category.map((v) => ({ type: "category" as const, value: v })),
  ];

  const hasFilters = activeChips.length > 0 || searchValue.trim().length > 0;

  const removeChip = (type: "gender" | "category", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchValue("");
  };

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#172B3A]">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-5 pt-7 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8A8176]"
        >
          <Link href="/" className="transition-colors hover:text-[#172B3A]">
            Home
          </Link>
          <span className="text-[#A68B57]">/</span>
          <span aria-current="page" className="text-[#172B3A]">
            Shop
          </span>
        </nav>
      </div>

      {/* Header */}
      <section className="mx-auto max-w-[1400px] px-5 pb-10 pt-6 sm:px-8 lg:px-12 lg:pb-12 lg:pt-10">
        <div className="flex flex-col gap-4 border-b border-[#DCD5CA] pb-10 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#A68B57]">
              Portovero
            </p>

            <h1 className="font-heading text-5xl font-medium tracking-[-0.045em] sm:text-6xl">
              Shop
            </h1>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[#766F66]">
            Timeless pieces selected for effortless,
            refined style.
          </p>
        </div>
      </section>

      {/* Shop content */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 lg:px-12">

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-5 border-b border-[#DCD5CA] pb-6 md:flex-row md:items-center md:justify-between">

          <div className="w-full md:max-w-md">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton filtres — visible uniquement mobile/tablette */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-[#DCD5CA]
                px-4
                py-2
                text-xs
                uppercase
                tracking-[0.15em]
                text-[#172B3A]
                transition-colors
                hover:border-[#A68B57]
                lg:hidden
              "
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeChips.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#A68B57] text-[10px] text-white">
                  {activeChips.length}
                </span>
              )}
            </button>

            <SortSelect
              value={sortValue}
              onChange={handleSortChange}
            />

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  text-xs
                  text-[#766F66]
                  underline
                  underline-offset-4
                  transition-colors
                  hover:text-[#172B3A]
                "
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={`${chip.type}-${chip.value}`}
                type="button"
                onClick={() => removeChip(chip.type, chip.value)}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[#EDE5DA]
                  px-3
                  py-1.5
                  text-xs
                  text-[#172B3A]
                  transition-colors
                  hover:bg-[#E4DACB]
                "
              >
                {formatFilterLabel(chip.value)}
                <X size={12} />
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">

          {/* Filters — desktop */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <div className="pb-2">
              <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-[#A68B57]">
                Filter by
              </p>

              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Collection */}
          <section className="min-w-0">

            <div className="mb-7 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] sm:text-3xl">
                  The Collection
                </h2>

                <p className="mt-1 text-xs text-[#8A837A]">
                  Carefully selected pieces
                </p>
              </div>
            </div>

            <ProductGrid
              search={searchValue}
              sort={sortValue}
              filters={filters}
            />

          </section>

        </div>
      </section>

      {/* Filters — mobile drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[#F8F5EF] shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#DCD5CA] px-6 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#A68B57]">
                Filter by
              </p>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-[#172B3A]"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>

            <div className="border-t border-[#DCD5CA] px-6 py-5">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-full bg-[#172B3A] py-3 text-xs uppercase tracking-[0.2em] text-white"
              >
                Show results
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}