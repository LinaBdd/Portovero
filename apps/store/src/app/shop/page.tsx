import { FilterSidebar } from "../../components/shop/FilterSidebar";
import { ProductGrid } from "../../components/shop/ProductGrid";
import { SearchBar } from "../../components/shop/SearchBar";
import { SortSelect } from "../../components/shop/SortSelect";

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">

      <div className="mb-10">

        <h1 className="text-5xl font-serif">
          Shop
        </h1>

        <p className="mt-3 text-neutral-500">
          Discover timeless pieces crafted for modern elegance.
        </p>

      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <SearchBar />

        <SortSelect />

      </div>

      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">

        <FilterSidebar />

        <ProductGrid />

      </div>

    </main>
  );
}