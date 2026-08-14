"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import type {
  Product,
  ProductColor,
  ProductVariant,
} from "../../types/product";

import { useCart } from "../../store/cart";

import { Button } from "../ui/button";
import { ColorSelector } from "./ColorSelector";
import { QuantitySelector } from "./QuantitySelector";
import { SizeSelector } from "./SizeSelector";

type Props = {
  product: Product;
};

export function ProductInfo({ product }: Props) {
  const { add } = useCart();

  const [selectedColor, setSelectedColor] =
    useState<ProductColor | null>(
      product.colors?.[0] ?? null
    );

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(
      product.colors?.[0]?.variants?.[0] ?? null
    );

  const [quantity, setQuantity] = useState(1);

  /*
   * =========================
   * CURRENT VARIANTS
   * =========================
   */

  const variants =
    selectedColor?.variants ?? [];

  /*
   * =========================
   * AVAILABLE SIZES
   * =========================
   */

  const sizes = useMemo(() => {
    return variants
      .filter((variant) => variant.size)
      .map((variant) => variant.size!);
  }, [variants]);

  /*
   * =========================
   * PRICE
   * =========================
   */

  const price = Number(product.base_price);

  const oldPrice =
    product.compare_at_price !== null
      ? Number(product.compare_at_price)
      : null;

  const hasSale =
    oldPrice !== null &&
    oldPrice > price;

  const discount = hasSale
    ? Math.round(
        ((oldPrice! - price) / oldPrice!) * 100
      )
    : null;

  /*
   * =========================
   * STOCK
   * =========================
   */

  const currentStock =
    selectedVariant?.stock ??
    product.stock;

  const isOutOfStock =
    currentStock <= 0;

  /*
   * =========================
   * COLOR CHANGE
   * =========================
   */

  const handleColorChange = (
    color: ProductColor
  ) => {
    setSelectedColor(color);

    /*
     * When the color changes,
     * reset the selected variant
     * to the first variant of that color.
     */

    const firstVariant =
      color.variants?.[0] ?? null;

    setSelectedVariant(firstVariant);

    /*
     * Reset quantity because
     * stock may be different.
     */

    setQuantity(1);
  };

  /*
   * =========================
   * SIZE CHANGE
   * =========================
   */

  const handleSizeChange = (
    variant: ProductVariant
  ) => {
    setSelectedVariant(variant);

    setQuantity(1);
  };

  /*
   * =========================
   * QUANTITY CHANGE
   * =========================
   */

  const handleQuantityChange = (
    value: number
  ) => {
    const max =
      selectedVariant?.stock ??
      product.stock;

    setQuantity(
      Math.max(
        1,
        Math.min(value, max)
      )
    );
  };

  /*
   * =========================
   * ADD TO CART
   * =========================
   */

  const handleAddToCart = () => {
    console.log("CLICK DETECTED");

    if (!selectedColor) {
      toast.error(
        "Veuillez sélectionner une couleur."
      );

      return;
    }

    if (
      variants.length > 0 &&
      !selectedVariant
    ) {
      toast.error(
        "Veuillez sélectionner une taille."
      );

      return;
    }

    if (currentStock <= 0) {
      toast.error(
        "Ce produit est en rupture de stock."
      );

      return;
    }

    if (quantity > currentStock) {
      toast.error(
        `Stock disponible : ${currentStock}`
      );

      return;
    }

    /*
     * TEMPORARY:
     * We will adapt the cart store
     * to ProductVariant in the next step.
     */

    if (!selectedVariant) {
     toast.error("Veuillez sélectionner une taille.");
     return;
    }

    add(product, selectedColor, selectedVariant, quantity);

    toast.success(
      "Produit ajouté au panier",
      {
        description:
          product.name,
      }
    );
  };

  return (
    <div className="space-y-8">

      {/* =========================
          PRODUCT INFO
      ========================== */}

      <div>

        {product.is_new && (
          <p className="uppercase tracking-[0.25em] text-[#C8A96A]">
            Nouveau
          </p>
        )}

        <h1 className="mt-3 text-5xl font-serif">
          {product.name}
        </h1>

        {product.sku && (
          <p className="mt-3 text-xs uppercase tracking-widest text-neutral-400">
            SKU : {product.sku}
          </p>
        )}

        <p className="mt-6 leading-8 text-neutral-600">
          {product.description}
        </p>

      </div>

      {/* =========================
          PRICE
      ========================== */}

      <div className="flex items-center gap-4">

        <span className="text-3xl font-bold">
          {price.toLocaleString("fr-DZ")} DA
        </span>

        {hasSale && (
          <>
            <span className="text-lg text-neutral-400 line-through">
              {oldPrice!.toLocaleString(
                "fr-DZ"
              )}{" "}
              DA
            </span>

            <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
              -{discount}%
            </span>
          </>
        )}

      </div>

      {/* =========================
          COLORS
      ========================== */}

      {product.colors &&
        product.colors.length > 0 && (
          <ColorSelector
            colors={product.colors}
            onChange={handleColorChange}
          />
        )}

      {/* =========================
          SIZES
      ========================== */}

      {sizes.length > 0 && (
        <SizeSelector
          sizes={sizes}
          variants={variants}
          selectedVariant={selectedVariant}
          onChange={handleSizeChange}
        />
      )}

      {/* =========================
          QUANTITY
      ========================== */}

      <QuantitySelector
        quantity={quantity}
        onChange={handleQuantityChange}
      />

      {/* =========================
          STOCK
      ========================== */}

      {isOutOfStock ? (
        <p className="text-sm font-medium text-red-600">
          ✕ Rupture de stock
        </p>
      ) : (
        <p className="text-sm font-medium text-green-700">
          ✓ {currentStock} article
          {currentStock > 1 ? "s" : ""} en stock
        </p>
      )}

      {/* =========================
          ADD TO CART
      ========================== */}

      <Button
        variant="primary"
        className="h-14 w-full text-lg"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {isOutOfStock
          ? "Rupture de stock"
          : "Ajouter au panier"}
      </Button>

    </div>
  );
}