import Image from "next/image";

export function BrandImage() {
  return (
    <div className="overflow-hidden rounded-[40px]">

      <Image
        src="/images/brand/story.jpg"
        alt="Portovero"
        width={700}
        height={900}
        className="h-full w-full object-cover transition duration-700 hover:scale-105"
      />

    </div>
  );
}