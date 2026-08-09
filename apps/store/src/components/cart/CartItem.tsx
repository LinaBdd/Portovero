"use client";

import Image from "next/image";
import Link from "next/link";

import type { CartItem as CartItemType } from "../../store/cart";
import { useCart } from "../../store/cart";
import { getImageUrl } from "../../lib/image";

type Props = {
  item: CartItemType;
};

export function CartItem({ item }: Props) {
  const {
    increase,
    decrease,
    remove,
  } = useCart();

  const { product, variant, quantity } = item;

  /*
   * ID unique de la ligne panier.
   * Deux variantes différentes du même produit
   * doivent être considérées comme deux lignes différentes.
   */
  const itemId = `${product.id}-${variant.id}`;

  /*
   * Prix de la variante si défini,
   * sinon prix de base du produit.
   */
  const price =
    variant.price !== null &&
    variant.price !== undefined
      ? Number(variant.price)
      : Number(product.base_price);

  /*
   * Image principale du produit.
   */
  const image =
    product.colors
      ?.flatMap(
        (color) => color.images ?? []
      )
      .find((image) => image.is_primary)
      ?.image_url ??
    product.colors
      ?.flatMap(
        (color) => color.images ?? []
      )[0]?.image_url;

  const imageUrl = image
    ? getImageUrl(image)
    : null;

  /*
   * Taille de la variante.
   */
  const size = variant.size?.name;

  return (
    <article className="flex gap-5 border-b py-6">
      {/* =========================
          IMAGE
      ========================== */}

      <Link
        href={`/product/${product.slug}`}
        className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}
      </Link>

      {/* =========================
          PRODUCT INFO
      ========================== */}

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/product/${product.slug}`}
            className="font-medium hover:underline"
          >
            {product.name}
          </Link>

          <p className="mt-1 text-sm text-neutral-500">
            SKU : {variant.sku}
          </p>

          {size && (
            <p className="mt-1 text-sm text-neutral-500">
              Taille : {size}
            </p>
          )}
        </div>

        {/* =========================
            PRICE
        ========================== */}

        <p className="mt-3 font-semibold">
          {price.toLocaleString("fr-DZ")} DA
        </p>
      </div>

      {/* =========================
          QUANTITY
      ========================== */}

      <div className="flex items-center gap-2 self-center">
        <button
          type="button"
          onClick={() => decrease(itemId)}
          className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-neutral-100"
        >
          −
        </button>

        <span className="w-8 text-center text-sm">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => increase(itemId)}
          disabled={quantity >= variant.stock}
          className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>

      {/* =========================
          TOTAL
      ========================== */}

      <div className="flex w-28 flex-col items-end justify-between">
        <p className="font-semibold">
          {(price * quantity).toLocaleString(
            "fr-DZ"
          )}{" "}
          DA
        </p>

        <button
          type="button"
          onClick={() => remove(itemId)}
          className="text-sm text-neutral-400 hover:text-red-600"
        >
          Supprimer
        </button>
      </div>
    </article>
  );
}