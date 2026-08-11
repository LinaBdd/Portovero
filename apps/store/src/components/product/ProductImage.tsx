import Image from "next/image";
import { ProductBadge } from "./ProductBadge";

interface Props {
  image?: string | null;
  hoverImage?: string | null;
  isNew?: boolean;
  isSale?: boolean;
}

export function ProductImage({
  image,
  hoverImage,
  isNew,
  isSale,
}: Props) {
  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">

      <ProductBadge
        isNew={isNew}
        isSale={isSale}
      />

      {image ? (
        <Image
          src={image}
          alt="Product"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-widest text-neutral-400">
          No image
        </div>
      )}

    </div>
  );
}