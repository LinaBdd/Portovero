const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// lib/images.ts
export function getImageUrl(image?: string): string {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/images")) return image;
  return `${API_URL}/${image.replace(/^\/+/, "")}`;
}

// Fonction utilitaire pour vérifier si une image existe
export function getProductImageUrl(product: { images?: string[] }, index: number = 0): string | null {
  if (!product.images || product.images.length === 0) {
    return null;
  }
  return getImageUrl(product.images[index]);
}