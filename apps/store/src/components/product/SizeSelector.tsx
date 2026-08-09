"use client";

import type {
  ProductVariant,
  Size,
} from "../../types/product";

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
  if (!sizes.length) {
    return null;
  }

  return (
    <div>
      <p className="mb-4 font-medium">
        Taille
      </p>

      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const variant = variants.find(
            (item) => item.size_id === size.id
          );

          if (!variant) {
            return null;
          }

          const isSelected =
            selectedVariant?.id === variant.id;

          const isOutOfStock =
            variant.stock <= 0;

          return (
            <button
              key={size.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onChange(variant)}
              className={`
                min-w-14
                rounded-lg
                border
                px-4
                py-3
                text-sm
                font-medium
                transition

                ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white hover:border-black"
                }

                ${
                  isOutOfStock
                    ? "cursor-not-allowed opacity-40 line-through"
                    : ""
                }
              `}
            >
              {size.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}