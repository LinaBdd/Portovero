import type { Product } from "../types/product";
import { getImageUrl } from "./utils";

/**
 * Prix affiché :
 * le plus bas parmi les variantes ayant un prix,
 * sinon base_price.
 */
export function getDisplayPrice(product: Product): number {
  const variantPrices =
    product.colors
      ?.flatMap((color) => color.variants ?? [])
      .map((variant) =>
        variant.price != null ? Number(variant.price) : null
      )
      .filter((price): price is number => price !== null) ?? [];

  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  return Number(product.base_price);
}

/**
 * Ancien prix.
 */
export function getOldPrice(
  product: Product
): number | undefined {
  if (
    product.compare_at_price !== null &&
    product.compare_at_price !== undefined
  ) {
    return Number(product.compare_at_price);
  }

  return undefined;
}

/**
 * Image principale du produit.
 */
export function getPrimaryImage(product: Product): string {
  for (const color of product.colors ?? []) {
    // Image primaire
    const primary = color.images?.find(
      (image) => image.is_primary
    );

    if (primary?.image_url) {
      return (
        getImageUrl(primary.image_url) ??
        "/images/placeholder.webp"
      );
    }

    // Sinon première image de la couleur
    const firstImage = color.images?.[0];

    if (firstImage?.image_url) {
      return (
        getImageUrl(firstImage.image_url) ??
        "/images/placeholder.webp"
      );
    }
  }

  return "/images/placeholder.webp";
}

/**
 * Retourne toutes les images du produit
 * avec les URLs complètes du backend.
 */
export function getAllImages(product: Product): string[] {
  const images =
    product.colors?.flatMap(
      (color) => color.images ?? []
    ) ?? [];

  const urls = images
    .map((image) => image.image_url)
    .filter(
      (url): url is string =>
        typeof url === "string" && url.trim().length > 0
    )
    .map((url) => {
      const normalized = getImageUrl(url);

      return normalized;
    })
    .filter(
      (url): url is string =>
        typeof url === "string" && url.length > 0
    );

  if (urls.length > 0) {
    return urls;
  }

  return ["/images/placeholder.webp"];
}

/**
 * Noms des couleurs.
 */
export function getColorNames(product: Product): string[] {
  return (product.colors ?? [])
    .map((color) => color.color?.name)
    .filter(
      (name): name is string => Boolean(name)
    );
}

/**
 * Noms des tailles disponibles.
 */
export function getSizeNames(product: Product): string[] {
  const names = new Set<string>();

  for (const color of product.colors ?? []) {
    for (const variant of color.variants ?? []) {
      if (variant.size?.name) {
        names.add(variant.size.name);
      }
    }
  }

  return Array.from(names);
}