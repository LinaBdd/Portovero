import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getImageUrl(
  path?: string | null
): string | null {
  if (!path) {
    return null;
  }

  // URL complète déjà fournie par le backend
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  // Nettoyage du chemin
  const normalizedPath = path.replace(/^\/+/, "");

  // uploads/... ou /uploads/...
  if (normalizedPath.startsWith("uploads/")) {
    return `${API_URL}/${normalizedPath}`;
  }

  // images/products/...
  if (normalizedPath.startsWith("images/products/")) {
    return `${API_URL}/uploads/${normalizedPath}`;
  }

  // men/shirt1.webp
  return `${API_URL}/uploads/images/products/${normalizedPath}`;
}