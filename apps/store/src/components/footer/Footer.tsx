import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t">

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10">

        <h2 className="text-2xl font-serif tracking-[0.3em]">
          PORTOVERO
        </h2>

        <div className="flex gap-8 text-sm text-neutral-600">

          <Link href="/">Home</Link>

          <Link href="/shop">Shop</Link>

          <Link href="/collections">Collections</Link>

          <Link href="/about">About</Link>

          <Link href="/contact">Contact</Link>

        </div>

        <p className="text-sm text-neutral-500">
          © 2026 Portovero. All rights reserved.
        </p>

      </div>

    </footer>
  );
}