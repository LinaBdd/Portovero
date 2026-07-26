"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[100px_1fr]">

      <div className="flex gap-4 lg:flex-col">

        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`overflow-hidden rounded-xl border-2 transition ${
              selected === index
                ? "border-black"
                : "border-transparent"
            }`}
          >
            <Image
              src={image}
              alt={name}
              width={90}
              height={120}
              className="h-28 w-20 object-cover"
            />
          </button>
        ))}

      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-100">

        <Image
          src={images[selected]}
          alt={name}
          fill
          priority
          className="object-cover transition duration-500 hover:scale-105"
        />

      </div>

    </div>
  );
}