"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
  name: string;
};

export function ProductGallery({
  images,
  name,
}: Props) {
  const [selected, setSelected] = useState(0);

  const validImages = images.filter(
    (image) =>
      typeof image === "string" &&
      image.trim().length > 0
  );

  useEffect(() => {
    setSelected(0);
  }, [images]);

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-3xl bg-neutral-100">
        <span className="text-sm uppercase tracking-widest text-neutral-400">
          No image
        </span>
      </div>
    );
  }

  const selectedImage =
    validImages[selected] ?? validImages[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[90px_1fr]">

      {/* THUMBNAILS */}

      <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
        {validImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelected(index)}
            className={`
              overflow-hidden
              rounded-xl
              border-2
              transition
              ${
                selected === index
                  ? "border-black"
                  : "border-transparent"
              }
            `}
          >
            <Image
              src={image}
              alt={`${name} - image ${index + 1}`}
              width={90}
              height={120}
              unoptimized
              className="h-28 w-20 object-cover"
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}

      <div
        className="
          order-1
          relative
          aspect-[4/5]
          overflow-hidden
          rounded-3xl
          bg-neutral-100
          lg:order-2
        "
      >
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </div>

    </div>
  );
}