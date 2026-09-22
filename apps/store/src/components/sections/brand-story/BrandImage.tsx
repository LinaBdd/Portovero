import Image from "next/image";

export function BrandImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  if (!src) return <div />;

  return (
    <div className="overflow-hidden rounded-[40px]">
      <Image
        src={src}
        alt={alt}
        width={700}
        height={900}
        unoptimized={src.startsWith("http")}
        className="h-full w-full object-cover transition duration-700 hover:scale-105"
      />
    </div>
  );
}
