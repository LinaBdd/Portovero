import { Product } from "../types/product";

/** Prix affiché : le plus bas parmi les variantes actives, sinon base_price */
export function getDisplayPrice(product: Product): number {
  const variantPrices =
    product.colors?.flatMap((c) => c.variants ?? [])
      .map((v) => (v.price != null ? Number(v.price) : null))
      .filter((v): v is number => v !== null) ?? [];

  if (variantPrices.length > 0) return Math.min(...variantPrices);

  return Number(product.base_price);
}

export function getOldPrice(product: Product): number | undefined {
  return product.compare_at_price ? Number(product.compare_at_price) : undefined;
}

export function getPrimaryImage(product: Product): string {
  for (const color of product.colors ?? []) {
    const primary = color.images?.find((img) => img.is_primary);
    if (primary) return primary.image_url;
    if (color.images?.[0]) return color.images[0].image_url;
  }
  return "/images/placeholder.webp";
}

export function getAllImages(product: Product): string[] {
  const imgs = product.colors?.flatMap((c) => c.images ?? [])
    .map((img) => img.image_url) ?? [];
  return imgs.length > 0 ? imgs : ["/images/placeholder.webp"];
}

export function getColorNames(product: Product): string[] {
  return (product.colors ?? [])
    .map((c) => c.color?.name)
    .filter((n): n is string => !!n);
}

export function getSizeNames(product: Product): string[] {
  const names = new Set<string>();
  for (const color of product.colors ?? []) {
    for (const variant of color.variants ?? []) {
      if (variant.size?.name) names.add(variant.size.name);
    }
  }
  return Array.from(names);
}