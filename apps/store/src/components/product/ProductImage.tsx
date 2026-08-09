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
  const imageSrc =
    hoverImage?.trim() ||
    image?.trim() ||
    null;

  return (
    <div className="relative h-[420px] w-full overflow-hidden bg-neutral-100">
      
      <ProductBadge
        isNew={isNew}
        isSale={isSale}
      />

      {imageSrc ? (
        <Image
          src={imageSrc}
          alt="Product"
          width={700}
          height={900}
          className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-[420px] w-full items-center justify-center bg-neutral-100 text-sm uppercase tracking-widest text-neutral-400">
          No image
        </div>
      )}

    </div>
  );
}