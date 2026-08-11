"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative w-full">
      {/* Search icon */}
      <Search
        size={19}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-neutral-400
        "
      />

      {/* Input */}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        autoComplete="off"
        className="
          h-12
          w-full
          rounded-full
          border
          border-neutral-300
          bg-white
          pl-12
          pr-12
          text-sm
          text-neutral-900
          outline-none
          transition
          placeholder:text-neutral-400
          hover:border-neutral-400
          focus:border-black
          focus:ring-1
          focus:ring-black
        "
      />

      {/* Clear button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-neutral-400
            transition
            hover:bg-neutral-100
            hover:text-black
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}