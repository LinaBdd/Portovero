"use client";

import { useState } from "react";

type Props = {
  sizes: string[];
};

export function SizeSelector({ sizes }: Props) {
  const [selected, setSelected] = useState(sizes[0]);

  return (
    <div>

      <p className="mb-4 font-medium">
        Size
      </p>

      <div className="flex flex-wrap gap-3">

        {sizes.map((size) => (

          <button
            key={size}
            onClick={() => setSelected(size)}
            className={`h-12 w-12 rounded-full border transition ${
              selected === size
                ? "bg-black text-white"
                : "hover:bg-neutral-100"
            }`}
          >
            {size}
          </button>

        ))}

      </div>

    </div>
  );
}