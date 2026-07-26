"use client";

import Link from "next/link";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Collections",
    href: "/collections",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export function NavLinks() {
  return (
    <nav className="hidden items-center gap-10 lg:flex">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm font-medium tracking-wide text-neutral-700 transition-colors duration-300 hover:text-black"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}