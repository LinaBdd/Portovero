"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";

import { useCart } from "../../store/cart";

export function NavIcons() {
  const { items } = useCart();

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="flex items-center gap-5">

      {/* Search */}

      <Link
        href="/search"
        className="transition hover:scale-110"
      >
        <Search className="h-5 w-5" />
      </Link>

      {/* Wishlist */}

      <Link
        href="/wishlist"
        className="transition hover:scale-110"
      >
        <Heart className="h-5 w-5" />
      </Link>

      {/* Cart */}

      <Link
        href="/cart"
        className="relative transition hover:scale-110"
      >
        <ShoppingBag className="h-5 w-5" />

        {totalItems > 0 && (
          <span
            className="
              absolute
              -right-2
              -top-2
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-[#0F2D52]
              px-1
              text-[10px]
              font-bold
              text-white
            "
          >
            {totalItems}
          </span>
        )}

      </Link>

    </div>
  );
}