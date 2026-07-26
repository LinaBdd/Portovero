import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export function CollectionCard({
  title,
  subtitle,
  image,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl"
    >
      <Image
        src={image}
        alt={title}
        width={700}
        height={900}
        className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute bottom-8 left-8 text-white">
        <p className="text-sm uppercase tracking-[0.2em]">
          {subtitle}
        </p>

        <h3 className="mt-2 text-4xl font-serif">
          {title}
        </h3>
      </div>
    </Link>
  );
}