const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export function getImageUrl(image?: string): string {
  if (!image) {
    return "";
  }

  // URL complète
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Image dans /public du frontend
  if (image.startsWith("/images")) {
    return image;
  }

  // Image backend
  return `${API_URL}/${image.replace(/^\/+/, "")}`;
}