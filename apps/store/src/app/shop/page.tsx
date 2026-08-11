"use client";

import { useState } from "react";

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

export default function ShopPage() {
  const [searchValue, setSearchValue] = useState("");

  const [sortValue, setSortValue] =
    useState<SortOption>("newest");

  const [filters, setFilters] =
    useState<ShopFilters>(DEFAULT_FILTERS);

  const handleSortChange = (value: string) => {
    setSortValue(value as SortOption);
  };

  const handleFilterChange = (newFilters: ShopFilters) => {
    setFilters(newFilters);
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">

      {/* HEADER */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl">
          Shop
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
          Discover timeless pieces crafted for modern elegance.
        </p>
      </header>

      {/* SEARCH + SORT */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="w-full sm:max-w-lg">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>

        <div className="w-full sm:w-auto">
          <SortSelect
            value={sortValue}
            onChange={handleSortChange}
          />
        </div>

      </div>

      {/* SHOP */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">

        {/* FILTERS */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
          />
        </aside>

        {/* PRODUCTS */}
        <section className="min-w-0">
          <ProductGrid
            search={searchValue}
            sort={sortValue}
            filters={filters}
          />
        </section>

      </div>

    </main>
  );
}