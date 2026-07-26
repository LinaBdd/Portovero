import Image from "next/image";
import { ProductBadge } from "./ProductBadge";

interface Props {
  image: string;
  hoverImage?: string;
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
    <div className="relative overflow-hidden rounded-3xl">

      <ProductBadge
        isNew={isNew}
        isSale={isSale}
      />

      <Image
        src={hoverImage ?? image}
        alt=""
        width={700}
        height={900}
        className="h-[420px] w-full object-cover transition duration-700 hover:scale-110"
      />

    </div>
  );
}