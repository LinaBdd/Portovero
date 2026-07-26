"use client";

import { useState } from "react";

type Props = {
  colors: string[];
};

export function ColorSelector({ colors }: Props) {
  const [selected, setSelected] = useState(colors[0]);

  return (
    <div>

      <p className="mb-4 font-medium">
        Color
      </p>

      <div className="flex gap-3">

        {colors.map((color) => (

          <button
            key={color}
            onClick={() => setSelected(color)}
            className={`rounded-full border px-5 py-2 transition ${
              selected === color
                ? "bg-black text-white"
                : "bg-white hover:bg-neutral-100"
            }`}
          >
            {color}
          </button>

        ))}

      </div>

    </div>
  );
}