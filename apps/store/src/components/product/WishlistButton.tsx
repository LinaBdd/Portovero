"use client";

import { Heart } from "lucide-react";

import { Product } from "../../types/product";

import { useWishlist } from "../../store/wishlist";

interface Props {
  product: Product;
}

export function WishlistButton({
  product,
}: Props) {

  const toggle = useWishlist((state) => state.toggle);

  const contains = useWishlist((state) =>
    state.contains(product.id)
  );

  return (

    <button
      onClick={() => toggle(product)}
      className="
      rounded-full
      border
      bg-white
      p-3
      shadow
      transition
      hover:scale-110
      "
    >

      <Heart
        className={`h-5 w-5 ${
          contains
            ? "fill-red-500 text-red-500"
            : ""
        }`}
      />

    </button>

  );

}