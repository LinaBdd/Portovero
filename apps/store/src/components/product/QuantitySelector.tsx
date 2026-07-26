"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex h-12 w-fit items-center rounded-full border">

      <button
        className="px-4"
        onClick={() =>
          setQuantity((q) => Math.max(1, q - 1))
        }
      >
        <Minus size={16} />
      </button>

      <span className="w-10 text-center">
        {quantity}
      </span>

      <button
        className="px-4"
        onClick={() =>
          setQuantity((q) => q + 1)
        }
      >
        <Plus size={16} />
      </button>

    </div>
  );
}