"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";

import type {
  Product,
  ProductColor,
  ProductVariant,
} from "../../types/product";

import { useCart } from "../../store/cart";
import { getImageUrl } from "../../lib/utils";
import { heading } from "../../lib/fonts";

import { ProductGallery } from "./ProductGallery";
import { ColorSelector } from "./ColorSelector";
import { SizeSelector } from "./SizeSelector";
import { QuantitySelector } from "./QuantitySelector";
import { WishlistButton } from "./WishlistButton";

type Props = {
  product: Product;
};

function safeNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/** Couleur + variante par défaut : la première avec du stock. */
function pickInitial(product: Product) {
  const color =
    product.colors?.find((c) =>
      c.variants?.some((v) => safeNumber(v.stock) > 0)
    ) ??
    product.colors?.[0] ??
    null;

  const variant =
    color?.variants?.find((v) => safeNumber(v.stock) > 0) ??
    color?.variants?.[0] ??
    null;

  return { color, variant };
}

/** URLs des images d'une couleur : image principale d'abord, puis par position. */
function colorImages(color: ProductColor | null | undefined): string[] {
  return [...(color?.images ?? [])]
    .sort(
      (a, b) =>
        (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
        (a.position ?? 0) - (b.position ?? 0)
    )
    .map((image) => getImageUrl(image.image_url))
    .filter(
      (url): url is string => typeof url === "string" && url.length > 0
    );
}

export function ProductDetail({ product }: Props) {
  const router = useRouter();
  const { add } = useCart();

  const initial = pickInitial(product);

  const [selectedColor, setSelectedColor] =
    useState<ProductColor | null>(initial.color);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(initial.variant);
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Barre d'achat flottante (mobile) : visible quand les boutons sortent de l'écran
  const actionsRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const next = pickInitial(product);
    setSelectedColor(next.color);
    setSelectedVariant(next.variant);
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variants = selectedColor?.variants ?? [];

  const sizes = useMemo(
    () =>
      variants
        .filter((v) => v.size && safeNumber(v.stock) > 0)
        .map((v) => v.size!),
    [variants]
  );

  // ---------- Images : celles de la couleur choisie ----------
  const allImages = useMemo(
    () => (product.colors ?? []).flatMap((c) => colorImages(c)),
    [product.colors]
  );

  const images = useMemo(() => {
    const own = colorImages(selectedColor);
    return own.length > 0 ? own : allImages;
  }, [selectedColor, allImages]);

  // ---------- Prix ----------
  const price = safeNumber(selectedVariant?.price ?? product.base_price);

  const oldPriceValue =
    product.compare_at_price !== null && product.compare_at_price !== undefined
      ? product.compare_at_price
      : selectedVariant?.price ?? null;

  const oldPrice =
    oldPriceValue !== null && oldPriceValue !== undefined
      ? safeNumber(oldPriceValue)
      : null;

  const hasSale = oldPrice !== null && oldPrice > price;
  const discount = hasSale ? Math.round(((oldPrice! - price) / oldPrice!) * 100) : null;
  const saving = hasSale ? oldPrice! - price : 0;

  // ---------- Stock (non affiché, sert seulement à bloquer l'achat) ----------
  const currentStock = safeNumber(selectedVariant?.stock ?? product.stock);
  const isOutOfStock = currentStock <= 0;

  // ---------- Note ----------
  const rating = Math.min(5, Math.max(0, safeNumber(product.rating)));
  const reviews = safeNumber(product.reviews);

  const badges = [
    product.is_new ? "NOUVEAU" : null,
    discount ? `-${discount}%` : null,
  ].filter((b): b is string => Boolean(b));

  const category = product.categories?.[0]?.name;

  // ---------- Handlers ----------
  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    setSelectedVariant(
      color.variants?.find((v) => safeNumber(v.stock) > 0) ??
        color.variants?.[0] ??
        null
    );
    setQuantity(1);
  };

  const handleSizeChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleQuantityChange = (value: number) => {
    const max = Math.max(1, currentStock);
    setQuantity(Math.max(1, Math.min(safeNumber(value, 1), max)));
  };

  function getSelection() {
    if (!selectedColor) {
      toast.error("Veuillez sélectionner une couleur.");
      return null;
    }
    if (!selectedVariant) {
      toast.error("Veuillez sélectionner une taille.");
      return null;
    }
    if (isOutOfStock) {
      toast.error("Ce produit est en rupture de stock.");
      return null;
    }
    if (quantity > currentStock) {
      toast.error("Cette quantité n'est pas disponible.");
      return null;
    }
    return { color: selectedColor, variant: selectedVariant };
  }

  const handleAddToCart = () => {
    const selection = getSelection();
    if (!selection) return;

    add(product, selection.color, selection.variant, quantity);

    toast.success("Produit ajouté au panier", { description: product.name });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const handleBuyNow = async () => {
    const selection = getSelection();
    if (!selection || ordering) return;

    try {
      setOrdering(true);
      // On attend l'ajout : pour un client connecté, le checkout lit le panier du serveur.
      await add(product, selection.color, selection.variant, quantity);
      router.push("/checkout");
    } catch {
      toast.error("Impossible de continuer. Réessayez.");
      setOrdering(false);
    }
  };

  return (
    <>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 xl:gap-24">
        {/* ======================= GALERIE ======================= */}
        <div className="min-w-0">
          <ProductGallery images={images} name={product.name} badges={badges} />
        </div>

        {/* ======================= INFOS ======================= */}
        <div className="max-w-[540px] lg:sticky lg:top-28">
          {category && (
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#B89B5E]">
              {category}
            </p>
          )}

          <div className="flex items-start justify-between gap-6">
            <h1
              className={`${heading.className} text-[42px] font-medium leading-[1.02] tracking-[-0.02em] text-[#172B3A] sm:text-5xl lg:text-[56px]`}
            >
              {product.name}
            </h1>
            <div className="shrink-0 pt-2">
              <WishlistButton product={product} />
            </div>
          </div>

          {rating > 0 && (
            <div className="mt-5 flex items-center gap-2">
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(rating)
                        ? "fill-[#B89B5E] text-[#B89B5E]"
                        : "fill-transparent text-[#D8CFC0]"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-[#81786D]">
                {rating.toFixed(1)} · {reviews} avis
              </span>
            </div>
          )}

          {/* Prix */}
          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span
              className={`${heading.className} text-[44px] font-medium leading-none text-[#172B3A]`}
            >
              {price.toLocaleString("fr-DZ")} DA
            </span>

            {hasSale && oldPrice !== null && (
              <span className="text-lg text-[#A69D91] line-through">
                {oldPrice.toLocaleString("fr-DZ")} DA
              </span>
            )}
          </div>

          {hasSale && (
            <p className="mt-3 text-sm text-[#9B3D3D]">
              Vous économisez {saving.toLocaleString("fr-DZ")} DA
            </p>
          )}

          <div className="my-9 h-px bg-[#172B3A]/10" />

          <div className="space-y-8">
            {product.colors && product.colors.length > 0 && (
              <ColorSelector
                colors={product.colors}
                selectedId={selectedColor?.id ?? null}
                onChange={handleColorChange}
              />
            )}

            {sizes.length > 0 && (
              <SizeSelector
                sizes={sizes}
                variants={variants}
                selectedVariant={selectedVariant}
                onChange={handleSizeChange}
              />
            )}
          </div>

          {/* Actions */}
          <div ref={actionsRef} className="mt-10 space-y-3">
            <div className="flex gap-3">
              <QuantitySelector
                quantity={quantity}
                onChange={handleQuantityChange}
                max={Math.max(1, currentStock)}
              />

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || ordering}
                className="h-14 flex-1 rounded-full bg-[#172B3A] text-[15px] font-medium tracking-wide text-white shadow-[0_14px_30px_-14px_rgba(23,43,58,.7)] transition duration-300 hover:bg-[#0F2D52] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isOutOfStock
                  ? "Rupture de stock"
                  : justAdded
                  ? "Ajouté ✓"
                  : "Ajouter au panier"}
              </button>
            </div>

            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={ordering}
                className="h-14 w-full rounded-full border border-[#172B3A]/25 text-[15px] font-medium text-[#172B3A] transition duration-300 hover:border-[#172B3A] hover:bg-[#172B3A]/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ordering ? "Redirection..." : "Commander maintenant"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============ Barre d'achat flottante (mobile) ============ */}
      <div
        aria-hidden={!showBar || isOutOfStock}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#172B3A]/10 bg-[#F7F3EC]/90 px-5 pt-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
          showBar && !isOutOfStock ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-[#172B3A]">{product.name}</p>
            <p className="text-sm text-[#81786D]">
              {price.toLocaleString("fr-DZ")} DA
            </p>
          </div>
          <button
            type="button"
            tabIndex={showBar ? 0 : -1}
            onClick={handleAddToCart}
            className="h-12 shrink-0 rounded-full bg-[#172B3A] px-7 text-sm font-medium text-white"
          >
            {justAdded ? "Ajouté ✓" : "Ajouter"}
          </button>
        </div>
      </div>
    </>
  );
}