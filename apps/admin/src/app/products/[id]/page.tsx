"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { ProductForm } from "../../../components/ProductForm";

import {
  fetchProduct,
  updateProduct,
  deleteProduct,
  ApiProduct,
  ProductPayload,
} from "../../../lib/api/products";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("Identifiant du produit invalide.");
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Erreur lors du chargement du produit :", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Impossible de charger le produit.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleSubmit(data: ProductPayload) {
   console.log("========== UPDATE ==========");
   console.log("PRODUCT ID:", id);
   console.log("DATA:", JSON.stringify(data, null, 2));

   try {
    const result = await updateProduct(id, data);

    console.log("========== RESPONSE ==========");
    console.log(JSON.stringify(result, null, 2));

    router.push("/products");
    router.refresh();
   } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    throw err;
   }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      router.push("/products");
      router.refresh();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Impossible de supprimer le produit.");
      }
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border p-6">
        Chargement du produit...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>

        <button
          type="button"
          onClick={() => router.push("/products")}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50"
        >
          Retour aux produits
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-lg border p-6">
        Produit introuvable.
      </div>
    );
  }

  /**
   * La première catégorie du produit.
   *
   * Ton ApiProduct contient :
   *
   * categories: [
   *   {
   *     category: {
   *       id,
   *       name,
   *       slug
   *     }
   *   }
   * ]
   */
  const categoryId =
    product.categories?.[0]?.category?.id ?? null;

  /**
   * Transformation du produit API vers le format attendu
   * par ProductForm.
   *
   * ProductForm accepte maintenant :
   * - informations générales
   * - catégorie
   * - couleurs
   * - images
   * - variantes
   */
  const initialData = {
    name: product.name,
    description: product.description ?? "",

    base_price: Number(product.base_price),

    compare_at_price:
      product.compare_at_price !== null
        ? Number(product.compare_at_price)
        : null,

    cost_price:
      product.cost_price !== null
        ? Number(product.cost_price)
        : null,

    stock: product.stock,

    weight:
      product.weight !== null
        ? Number(product.weight)
        : null,

    gender: product.gender,

    category_id: categoryId,

    is_active: product.is_active,
    is_featured: product.is_featured,
    is_new: product.is_new,

    /**
     * Couleurs existantes
     */
    colors: product.colors.map((productColor) => ({
      color_id: productColor.color_id,

      images: productColor.images.map((image) => ({
        url: image.image_url,
        alt: image.alt,
        position: image.position,
        is_primary: image.is_primary,
      })),
    })),

    /**
     * Toutes les variantes de toutes les couleurs.
     *
     * IMPORTANT :
     * L'API retourne product_color_id.
     *
     * ProductVariantPayload attend color_id.
     *
     * On récupère donc le color_id depuis le ProductColor parent.
     */
    variants: product.colors.flatMap((productColor) =>
      productColor.variants.map((variant) => ({
        id: variant.id,

        color_id: productColor.color_id,

        size_id: variant.size_id,

        stock: variant.stock,

        price: Number(variant.price),

        old_price:
          variant.old_price !== null
            ? Number(variant.old_price)
            : null,

        is_active: variant.is_active,
      }))
    ),
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Modifier — {product.name}
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            SKU : {product.sku}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Supprimer
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <ProductForm
        initial={initialData}
        onSubmit={handleSubmit}
        submitLabel="Mettre à jour"
      />
    </div>
  );
}