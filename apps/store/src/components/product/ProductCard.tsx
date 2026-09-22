"use client";

import Link from "next/link";

import type { Product } from "../../types/product";

import { getImageUrl } from "../../lib/utils";

import { ProductActions } from "./ProductActions";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({
  product,
}: ProductCardProps) {
  // L'image principale est déjà résolue par adaptToListProduct/getFullProduct
  // (via les couleurs du produit) : pas besoin d'un appel réseau ici.
  const image = getImageUrl(product.images?.[0]);
  const hoverImage = null;
  const imagesLoading = false;

  /*
   * The API returns prices as strings.
   *
   * Example:
   * "base_price": "4500.00"
   */
  const price = Number(product.base_price);

  const oldPrice = product.compare_at_price
    ? Number(product.compare_at_price)
    : undefined;

  const hasSale =
    oldPrice !== undefined &&
    oldPrice > price;

  const isOutOfStock =
    product.stock <= 0;

  return (
    <article className="group relative">

      {/* =========================
          PRODUCT IMAGE
      ========================== */}

      <div className="relative">

        <Link
          href={`/product/${product.slug}`}
          className="group block"
        >
          {imagesLoading ? (
            <div className="flex h-[420px] w-full animate-pulse items-center justify-center bg-neutral-100">
              <span className="text-sm text-neutral-400">
                Loading...
              </span>
            </div>
          ) : (
            <ProductImage
              image={image}
              hoverImage={hoverImage}
              isNew={product.is_new}
              isSale={hasSale}
            />
          )}
        </Link>

        {/* =========================
            PRODUCT ACTIONS
        ========================== */}

        {!isOutOfStock && (
          <ProductActions />
        )}

        {/* =========================
            WISHLIST
        ========================== */}

        <div className="absolute right-4 top-4 z-10">
          <WishlistButton
            product={product}
          />
        </div>

      </div>

      {/* =========================
          PRODUCT INFORMATION
      ========================== */}

      <div className="mt-5 space-y-2">

        {/* Product name */}

        <Link
          href={`/product/${product.slug}`}
        >
          <h3
            className="
              text-lg
              font-semibold
              transition
              hover:text-[#C8A96A]
            "
          >
            {product.name}
          </h3>
        </Link>

        

        {/* =========================
            PRICE
        ========================== */}

        <div className="flex items-center gap-2">

          <span className="font-semibold">
            {price.toLocaleString("fr-DZ")} DA
          </span>

          {hasSale && oldPrice !== undefined && (
            <span
              className="
                text-sm
                text-neutral-400
                line-through
              "
            >
              {oldPrice.toLocaleString("fr-DZ")} DA
            </span>
          )}

        </div>

        {/* =========================
            STOCK
        ========================== */}

        {isOutOfStock && <p className="text-sm text-red-500">Épuisé</p>}

      </div>

    </article>
  );
}