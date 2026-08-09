"use client";

import { useEffect, useState } from "react";

import { getProductColors } from "../services/productColors";
import { getProductImagesByColor } from "../services/productImages";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";


function getFullImageUrl(
  imageUrl?: string
): string | undefined {

  if (!imageUrl) {
    return undefined;
  }

  // Déjà une URL complète
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  // Chemin venant du backend
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


        // 1. récupérer les couleurs du produit
        const productColors =
          await getProductColors(productId);


        if (cancelled) return;


        if (!productColors.length) {

          setImage(undefined);
          setHoverImage(undefined);

          return;
        }



        // 2. récupérer les images de chaque couleur

        const imageRequests =
          productColors.map(
            (productColor) =>
              getProductImagesByColor(
                productColor.id
              )
          );


        const results =
          await Promise.all(imageRequests);



        if (cancelled) return;



        // 3. fusionner les tableaux

        const images =
          results.flat();



        if (!images.length) {

          setImage(undefined);
          setHoverImage(undefined);

          return;
        }



        // 4. tri

        const sortedImages =
          [...images].sort(
            (a, b) =>
              (a.display_order ?? 0) -
              (b.display_order ?? 0)
          );



        // 5. image principale

        const primaryImage =
          sortedImages.find(
            (img) =>
              img.is_primary
          )
          ??
          sortedImages[0];



        const secondImage =
          sortedImages.find(
            (img) =>
              img.id !== primaryImage.id
          );



        setImage(
          getFullImageUrl(
            primaryImage?.image_url
          )
        );


        setHoverImage(
          getFullImageUrl(
            secondImage?.image_url
            ??
            primaryImage?.image_url
          )
        );


      } catch(err) {


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

}