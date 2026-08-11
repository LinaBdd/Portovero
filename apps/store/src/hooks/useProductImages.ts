"use client";

import { useEffect, useState } from "react";

import { getProductColors } from "../services/productColors";
import { getProductImagesByColor } from "../services/productImages";

const API_URL = "http://127.0.0.1:8000";

function getFullImageUrl(
  imageUrl?: string
): string | undefined {
  if (!imageUrl) return undefined;

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_URL}${imageUrl}`;
  }

  return `${API_URL}/${imageUrl}`;
}

interface UseProductImagesResult {
  image: string | undefined;
  hoverImage: string | undefined;
  loading: boolean;
  error: string | null;
}

export function useProductImages(
  productId: number
): UseProductImagesResult {
  const [image, setImage] =
    useState<string | undefined>();

  const [hoverImage, setHoverImage] =
    useState<string | undefined>();

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      try {
        setLoading(true);
        setError(null);

        // 1. Récupérer les couleurs
        const productColors =
          await getProductColors(productId);

        console.log(
          "PRODUCT COLORS:",
          productId,
          productColors
        );

        if (cancelled) return;

        if (!productColors.length) {
          setImage(undefined);
          setHoverImage(undefined);
          return;
        }

        // 2. Récupérer les images
        const results = await Promise.all(
          productColors.map((productColor) =>
            getProductImagesByColor(productColor.id)
          )
        );

        console.log(
          "IMAGE RESULTS:",
          results
        );

        if (cancelled) return;

        // 3. Fusionner
        const images = results.flat();

        console.log(
          "FINAL IMAGES:",
          images
        );

        if (!images.length) {
          setImage(undefined);
          setHoverImage(undefined);
          return;
        }

        // 4. Trier
        const sortedImages = [...images].sort(
          (a, b) =>
            (a.position ?? 0) -
            (b.position ?? 0)
        );

        // 5. Image principale
        const primaryImage =
          sortedImages.find(
            (img) => img.is_primary === true
          ) ?? sortedImages[0];

        // 6. Image secondaire
        const secondImage =
          sortedImages.find(
            (img) =>
              img.id !== primaryImage.id
          );

        const mainUrl = getFullImageUrl(
          primaryImage.image_url
        );

        const hoverUrl = getFullImageUrl(
          secondImage?.image_url ??
            primaryImage.image_url
        );

        console.log("MAIN URL:", mainUrl);
        console.log("HOVER URL:", hoverUrl);
         

        console.log("IMAGE FROM BACKEND:", primaryImage.image_url);
        console.log("FINAL IMAGE URL:", mainUrl);
        setImage(mainUrl);
        setHoverImage(hoverUrl);

      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load product images:",
          err
        );

        setError(
          "Unable to load product images."
        );

        setImage(undefined);
        setHoverImage(undefined);

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return {
    image,
    hoverImage,
    loading,
    error,
  };

function getFullImageUrl(
  imageUrl?: string | null
): string | undefined {
  if (!imageUrl) {
    return undefined;
  }

  const url = imageUrl.trim();

  if (!url) {
    return undefined;
  }

  // Déjà une URL complète
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  // Le backend renvoie par exemple :
  // /uploads/images/products/men/shirt1.webp
  if (url.startsWith("/")) {
    return `${API_URL}${url}`;
  }

  // Le backend renvoie par exemple :
  // uploads/images/products/men/shirt1.webp
  return `${API_URL}/${url}`;
}
}