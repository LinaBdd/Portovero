"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({
  quantity,
  onChange,
}: Props) {
  const decrease = () => {
    onChange(Math.max(1, quantity - 1));
  };

  const increase = () => {
    onChange(quantity + 1);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-wider text-neutral-600">
        Quantité
      </p>

      <div className="flex h-12 w-fit items-center overflow-hidden rounded-full border border-neutral-300 bg-white shadow-sm">

        <button
          type="button"
          onClick={decrease}
          className="flex h-full w-12 items-center justify-center transition hover:bg-[#0F2D52] hover:text-white"
        >
          <Minus size={16} />
        </button>

        <span className="flex w-12 items-center justify-center font-semibold">
          {quantity}
        </span>

        <button
          type="button"
          onClick={increase}
          className="flex h-full w-12 items-center justify-center transition hover:bg-[#0F2D52] hover:text-white"
        >
          <Plus size={16} />
        </button>

      </div>
    </div>
  );
}