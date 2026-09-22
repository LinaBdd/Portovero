"use client";

import type { ProductVariant, Size } from "../../types/product";

type Props = {
  sizes: Size[];
  selectedVariant: ProductVariant | null;
  onChange: (variant: ProductVariant) => void;
  variants: ProductVariant[];
};

export function SizeSelector({
  sizes,
  selectedVariant,
  onChange,
  variants,
}: Props) {
  if (!sizes.length) return null;

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#81786D]">
          Taille
        </p>
        <p className="text-sm text-[#172B3A]">{selectedVariant?.size?.name}</p>
      </div>

      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Taille">
        {sizes.map((size) => {
          const variant = variants.find((item) => item.size_id === size.id);
          if (!variant) return null;

          const selected = selectedVariant?.id === variant.id;
          const outOfStock = variant.stock <= 0;

          return (
            <button
              key={size.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={outOfStock}
              onClick={() => onChange(variant)}
              className={`h-12 min-w-[56px] rounded-full px-5 text-sm font-medium transition duration-300 ${
                selected
                  ? "bg-[#172B3A] text-white shadow-[0_8px_20px_-8px_rgba(23,43,58,.6)]"
                  : "border border-[#172B3A]/20 bg-white/60 text-[#172B3A] hover:border-[#172B3A]"
              } ${outOfStock ? "cursor-not-allowed line-through opacity-40" : ""}`}
            >
              {size.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}