"use client";

import type { ProductColor } from "../../types/product";

type Props = {
  colors: ProductColor[];
  selectedId?: number | null;
  onChange?: (color: ProductColor) => void;
};

export function ColorSelector({ colors, selectedId, onChange }: Props) {
  if (!colors.length) return null;

  const activeId = selectedId ?? colors[0]?.id ?? null;
  const active = colors.find((c) => c.id === activeId);

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#81786D]">
          Couleur
        </p>
        <p className="text-sm text-[#172B3A]">{active?.color?.name}</p>
      </div>

      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Couleur">
        {colors.map((productColor) => {
          const color = productColor.color;
          if (!color) return null;

          const selected = productColor.id === activeId;
          const inStock = (productColor.variants ?? []).some(
            (v) => Number(v.stock) > 0
          );

          return (
            <button
              key={productColor.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={color.name}
              title={color.name}
              onClick={() => onChange?.(productColor)}
              className={`h-11 w-11 rounded-full p-[3px] transition duration-300 ${
                selected
                  ? "ring-2 ring-[#172B3A] ring-offset-2 ring-offset-[#F7F3EC]"
                  : "ring-1 ring-black/10 hover:ring-black/40"
              } ${inStock ? "" : "opacity-40"}`}
            >
              <span
                className="block h-full w-full rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                style={{ backgroundColor: color.hex_code }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}