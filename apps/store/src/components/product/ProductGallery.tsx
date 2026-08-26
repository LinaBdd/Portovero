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
  const validImages = images.filter(
    (image) =>
      typeof image === "string" &&
      image.trim().length > 0
  );

  const [selected, setSelected] = useState(0);

  /*
   * Reset lorsque le produit change.
   */

  useEffect(() => {
    setSelected(0);
  }, [images]);

  /*
   * Aucun visuel
   */

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[28px] bg-[#EDE5DA]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A8176]">
          No image
        </span>
      </div>
    );
  }

  const selectedImage =
    validImages[selected] ??
    validImages[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[82px_minmax(0,1fr)]">

      {/* ======================================================
          THUMBNAILS
      ====================================================== */}

      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {validImages.map(
          (image, index) => {
            const isSelected =
              selected === index;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Voir l'image ${
                  index + 1
                }`}
                aria-current={
                  isSelected
                    ? "true"
                    : undefined
                }
                onClick={() =>
                  setSelected(index)
                }
                className={`
                  relative shrink-0
                  overflow-hidden
                  rounded-[18px]
                  border
                  bg-[#EDE5DA]
                  transition-all
                  duration-300
                  lg:h-[108px]
                  lg:w-[82px]
                  ${
                    isSelected
                      ? "border-[#172B3A] ring-1 ring-[#172B3A]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }
                `}
              >
                <Image
                  src={image}
                  alt={`${name} - image ${
                    index + 1
                  }`}
                  fill
                  sizes="82px"
                  unoptimized
                  className="object-cover"
                />
              </button>
            );
          }
        )}
      </div>

      {/* ======================================================
          MAIN IMAGE
      ====================================================== */}

      <div
        className="
          order-1
          relative
          aspect-[4/5]
          max-h-[760px]
          min-h-[500px]
          overflow-hidden
          rounded-[28px]
          bg-[#EDE5DA]
          lg:order-2
        "
      >
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          unoptimized
          sizes="
            (max-width: 1024px) 100vw,
            60vw
          "
          className="
            object-cover
            transition-transform
            duration-700
            hover:scale-[1.02]
          "
        />
      </div>
    </div>
  );
}