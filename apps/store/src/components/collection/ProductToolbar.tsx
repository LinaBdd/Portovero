import { SlidersHorizontal } from "lucide-react";

export function ProductToolbar() {
  return (
    <section className="border-y bg-white">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <p className="text-neutral-600">
          Showing <strong>24</strong> products
        </p>

        <div className="flex items-center gap-4">

          <button className="flex items-center gap-2 rounded-full border px-5 py-3 hover:bg-neutral-100">

            <SlidersHorizontal size={18} />

            Filters

          </button>

          <select className="rounded-full border px-5 py-3">

            <option>Newest</option>

            <option>Price Low → High</option>

            <option>Price High → Low</option>

            <option>Best Sellers</option>

          </select>

        </div>

      </div>

    </section>
  );
}