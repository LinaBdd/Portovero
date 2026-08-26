"use client";

import { useEffect, useMemo, useState } from "react";
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

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

export function ProductInfo({ product }: Props) {
  const { add } = useCart();

  /*
   * ============================================================
   * INITIAL COLOR
   * ============================================================
   */

  const initialColor =
    product.colors?.find((color) =>
      color.variants?.some(
        (variant) =>
          safeNumber(variant.stock) > 0
      )
    ) ??
    product.colors?.[0] ??
    null;

  const initialVariant =
    initialColor?.variants?.find(
      (variant) =>
        safeNumber(variant.stock) > 0
    ) ??
    initialColor?.variants?.[0] ??
    null;

  const [selectedColor, setSelectedColor] =
    useState<ProductColor | null>(initialColor);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(initialVariant);

  const [quantity, setQuantity] = useState(1);

  /*
   * ============================================================
   * SYNC WHEN PRODUCT CHANGES
   * ============================================================
   */

  useEffect(() => {
    const color =
      product.colors?.find((item) =>
        item.variants?.some(
          (variant) =>
            safeNumber(variant.stock) > 0
        )
      ) ??
      product.colors?.[0] ??
      null;

    const variant =
      color?.variants?.find(
        (item) =>
          safeNumber(item.stock) > 0
      ) ??
      color?.variants?.[0] ??
      null;

    setSelectedColor(color);
    setSelectedVariant(variant);
    setQuantity(1);
  }, [product]);

  /*
   * ============================================================
   * CURRENT VARIANTS
   * ============================================================
   */

  const variants = selectedColor?.variants ?? [];

  /*
   * ============================================================
   * AVAILABLE SIZES
   * ============================================================
   */

  const sizes = useMemo(() => {
    return variants
      .filter(
        (variant) =>
          variant.size &&
          safeNumber(variant.stock) > 0
      )
      .map((variant) => variant.size!);
  }, [variants]);

  /*
   * ============================================================
   * CURRENT PRICE
   *
   * IMPORTANT:
   * Le prix vient de la variante sélectionnée.
   * Sinon on utilise le prix de base du produit.
   * ============================================================
   */

  const price = safeNumber(
    selectedVariant?.price ??
      product.base_price
  );

  const oldPriceValue =
    product.compare_at_price !== null &&
    product.compare_at_price !== undefined
      ? product.compare_at_price
      : selectedVariant?.price ?? null;

  const oldPrice =
    oldPriceValue !== null &&
    oldPriceValue !== undefined
      ? safeNumber(oldPriceValue)
      : null;

  const hasSale =
    oldPrice !== null &&
    Number.isFinite(oldPrice) &&
    oldPrice > price;

  const discount = hasSale
    ? Math.round(
        ((oldPrice - price) / oldPrice) * 100
      )
    : null;

  /*
   * ============================================================
   * STOCK
   * ============================================================
   */

  const currentStock = safeNumber(
    selectedVariant?.stock ??
      product.stock
  );

  const isOutOfStock =
    currentStock <= 0;

  /*
   * ============================================================
   * COLOR CHANGE
   * ============================================================
   */

  const handleColorChange = (
    color: ProductColor
  ) => {
    setSelectedColor(color);

    const firstAvailableVariant =
      color.variants?.find(
        (variant) =>
          safeNumber(variant.stock) > 0
      ) ??
      color.variants?.[0] ??
      null;

    setSelectedVariant(
      firstAvailableVariant
    );

    setQuantity(1);
  };

  /*
   * ============================================================
   * SIZE CHANGE
   * ============================================================
   */

  const handleSizeChange = (
    variant: ProductVariant
  ) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  /*
   * ============================================================
   * QUANTITY CHANGE
   * ============================================================
   */

  const handleQuantityChange = (
    value: number
  ) => {
    const safeValue = safeNumber(value, 1);
    const max = Math.max(1, currentStock);

    setQuantity(
      Math.max(
        1,
        Math.min(safeValue, max)
      )
    );
  };

  /*
   * ============================================================
   * ADD TO CART
   * ============================================================
   */

  const handleAddToCart = () => {
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

    if (
      !selectedVariant &&
      variants.length > 0
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

    if (!selectedVariant) {
      toast.error(
        "Veuillez sélectionner une taille."
      );
      return;
    }

    add(
      product,
      selectedColor,
      selectedVariant,
      quantity
    );

    toast.success(
      "Produit ajouté au panier",
      {
        description: product.name,
      }
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="space-y-8">

      {/* ======================================================
          PRODUCT META

          IMPORTANT:
          Le titre du produit est volontairement supprimé ici.
          ProductPage l'affiche déjà.
      ====================================================== */}

      <div>
        {product.is_new && (
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C8A96A]">
            Nouveau
          </p>
        )}

        {product.sku && (
          <p className="mt-3 text-xs uppercase tracking-widest text-neutral-400">
            SKU : {product.sku}
          </p>
        )}

        {product.description && (
          <p className="mt-6 max-w-xl leading-8 text-neutral-600">
            {product.description}
          </p>
        )}
      </div>

      {/* ======================================================
          PRICE
      ====================================================== */}

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-3xl font-bold text-[#172B3A]">
          {price.toLocaleString("fr-DZ")} DA
        </span>

        {hasSale && oldPrice !== null && (
          <>
            <span className="text-lg text-neutral-400 line-through">
              {oldPrice.toLocaleString(
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

      {/* ======================================================
          COLORS
      ====================================================== */}

      {product.colors &&
        product.colors.length > 0 && (
          <ColorSelector
            colors={product.colors}
            onChange={handleColorChange}
          />
        )}

      {/* ======================================================
          SIZES
      ====================================================== */}

      {sizes.length > 0 && (
        <SizeSelector
          sizes={sizes}
          variants={variants}
          selectedVariant={selectedVariant}
          onChange={handleSizeChange}
        />
      )}

      {/* ======================================================
          QUANTITY
      ====================================================== */}

      <QuantitySelector
        quantity={quantity}
        onChange={handleQuantityChange}
      />

      {/* ======================================================
          STOCK
      ====================================================== */}

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

      {/* ======================================================
          ADD TO CART
      ====================================================== */}

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