"use client";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({
  value,
  onChange,
}: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-neutral-300 px-5 py-3 outline-none"
    >
      <option value="newest">
        Newest
      </option>

      <option value="best_sellers">
        Best Sellers
      </option>

      <option value="highest_rated">
        Highest Rated
      </option>

      <option value="price_asc">
        Price ↑
      </option>

      <option value="price_desc">
        Price ↓
      </option>
    </select>
  );
}