"use client";

import { useEffect, useState } from "react";

import type { ProductColor } from "../../types/product";

type Props = {
  colors: ProductColor[];
  onChange?: (color: ProductColor) => void;
};

export function ColorSelector({
  colors,
  onChange,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(
    colors[0]?.id ?? null
  );

  useEffect(() => {
    setSelectedId(colors[0]?.id ?? null);
  }, [colors]);

  if (!colors.length) {
    return null;
  }

  const handleSelect = (color: ProductColor) => {
    setSelectedId(color.id);
    onChange?.(color);
  };

  return (
    <div>
      <p className="mb-4 font-medium">
        Color
        {selectedId !== null && (
          <span className="ml-2 text-neutral-500">
            {colors.find((color) => color.id === selectedId)?.color?.name}
          </span>
        )}
      </p>

      <div className="flex flex-wrap gap-3">
        {colors.map((productColor) => {
          const color = productColor.color;

          if (!color) {
            return null;
          }

          const isSelected =
            selectedId === productColor.id;

          return (
            <button
              key={productColor.id}
              type="button"
              onClick={() => handleSelect(productColor)}
              title={color.name}
              aria-label={`Select ${color.name}`}
              aria-pressed={isSelected}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border-2
                transition
                ${
                  isSelected
                    ? "border-black"
                    : "border-transparent"
                }
              `}
            >
              <span
                className="h-8 w-8 rounded-full border border-neutral-200"
                style={{
                  backgroundColor: color.hex_code,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}