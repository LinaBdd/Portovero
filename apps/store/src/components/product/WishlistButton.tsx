"use client";

import { Heart } from "lucide-react";

import { Product } from "../../types/product";
import { useAuth } from "../../store/auth";
import { useWishlistStore } from "../../store/wishlist";
import { useWishlistGuest } from "../../store/wishlistGuest";

interface Props {
  product: Product;
}

export function WishlistButton({ product }: Props) {
  const user = useAuth((state) => state.user);

  // Logged-in wishlist
  const toggleWishlist = useWishlistStore(
    (state) => state.toggle
  );

  const wishlistContains = useWishlistStore(
    (state) => state.contains
  );

  // Guest wishlist
  const toggleGuest = useWishlistGuest(
    (state) => state.toggle
  );

  const guestHas = useWishlistGuest(
    (state) => state.has
  );

  const isGuest = !user;

  const isSaved = isGuest
    ? guestHas(product.id)
    : wishlistContains(product.id);

  const handleToggle = () => {
    if (isGuest) {
      toggleGuest({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images?.[0] ?? null,
      });

      return;
    }

    toggleWishlist(product);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        isSaved
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      aria-pressed={isSaved}
      className="
        group
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        border
        border-[#D8CEC0]
        bg-[#F7F3EC]
        transition-all
        duration-200
        hover:scale-105
        hover:border-[#B89B5E]
        hover:bg-white
        active:scale-95
      "
    >
      <Heart
        className={`
          h-5
          w-5
          transition-all
          duration-200
          ${
            isSaved
              ? "fill-[#B89B5E] text-[#B89B5E]"
              : "text-[#172B3A] group-hover:text-[#B89B5E]"
          }
        `}
        strokeWidth={1.5}
      />
    </button>
  );
}