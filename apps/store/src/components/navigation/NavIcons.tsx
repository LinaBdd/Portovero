"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Search, ShoppingBag, User } from "lucide-react";

import { useCart } from "../../store/cart";
import { useAuth } from "../../store/auth"; // 👈 nouveau store, pas context/AuthContext

export function NavIcons() {
  const router = useRouter();

  const { items } = useCart();
  const { user, logout } = useAuth();

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex items-center gap-5">
      <Link href="/search" className="transition hover:scale-110">
        <Search className="h-5 w-5" />
      </Link>

      <Link href="/wishlist" className="transition hover:scale-110">
        <Heart className="h-5 w-5" />
      </Link>

      <Link href="/cart" className="relative transition hover:scale-110">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F2D52] px-1 text-[10px] font-bold text-white">
            {totalItems}
          </span>
        )}
      </Link>

      {user ? (
        <div className="relative group">
          <button className="flex items-center gap-2 text-sm font-medium">
            <User className="h-5 w-5" />
            <span>Bonjour {user.first_name}</span>
          </button>

          <div className="invisible absolute right-0 mt-4 w-52 rounded-xl border bg-white shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <Link href="/account" className="block px-5 py-3 hover:bg-neutral-100">
              My Account
            </Link>
            <Link href="/account/orders" className="block px-5 py-3 hover:bg-neutral-100">
              Orders
            </Link>
            <Link href="/wishlist" className="block px-5 py-3 hover:bg-neutral-100">
              Wishlist
            </Link>
            <Link href="/account/addresses" className="block px-5 py-3 hover:bg-neutral-100">
              Addresses
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-5 py-3 text-left text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <Link
          href="/account/login"
          className="flex items-center gap-2 text-sm font-medium hover:text-[#0F2D52]"
        >
          <User className="h-5 w-5" />
          Login
        </Link>
      )}
    </div>
  );
}