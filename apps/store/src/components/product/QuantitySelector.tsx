"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  onChange: (value: number) => void;
  /** Quantité maximale (le stock n'est pas affiché, il bloque seulement le « + »). */
  max?: number;
};

export function QuantitySelector({ quantity, onChange, max }: Props) {
  const atMax = max !== undefined && quantity >= max;

  return (
    <div
      className="flex h-14 w-fit shrink-0 items-center rounded-full border border-[#172B3A]/20 bg-white/60"
      role="group"
      aria-label="Quantité"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Diminuer la quantité"
        className="flex h-full w-12 items-center justify-center rounded-l-full text-[#172B3A] transition hover:bg-[#172B3A]/5 disabled:opacity-30"
      >
        <Minus size={16} />
      </button>

      <span
        className="w-8 text-center text-base font-medium tabular-nums text-[#172B3A]"
        aria-live="polite"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label="Augmenter la quantité"
        className="flex h-full w-12 items-center justify-center rounded-r-full text-[#172B3A] transition hover:bg-[#172B3A]/5 disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}