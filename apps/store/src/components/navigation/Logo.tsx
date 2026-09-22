import Link from "next/link";

export function Logo({ brandName }: { brandName: string }) {
  return (
    <Link
      href="/"
      className="text-3xl font-serif tracking-[0.35em] font-semibold"
    >
      {brandName.toUpperCase()}
    </Link>
  );
}