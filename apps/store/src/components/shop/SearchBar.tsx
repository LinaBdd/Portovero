"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="text"
        placeholder="Search products..."
        className="w-full rounded-full border border-neutral-300 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-black"
      />
    </div>
  );
}