"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";

import { Container } from "../../components/ui/container";
import { Logo } from "../../components/ui/logo";
import { NavLinks } from "./NavLinks";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">

          <Logo />

          <NavLinks />

          <div className="flex items-center gap-5">

            <Link
              href="/search"
              className="transition hover:opacity-70"
            >
              <Search size={20} />
            </Link>

            <Link
              href="/wishlist"
              className="transition hover:opacity-70"
            >
              <Heart size={20} />
            </Link>

            <Link
              href="/cart"
              className="transition hover:opacity-70"
            >
              <ShoppingBag size={20} />
            </Link>

          </div>

        </div>
      </Container>
    </header>
  );
}