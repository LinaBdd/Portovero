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

  useEffect(() => {
    fetchProduct(id).then(setProduct).catch(console.error);
  }, [id]);

  async function handleSubmit(data: ProductPayload) {
    await updateProduct(id, data);
    router.push("/products");
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce produit ?")) return;
    await deleteProduct(id);
    router.push("/products");
  }

  if (!product) return <p>Chargement...</p>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modifier — {product.name}</h1>
        <button
          onClick={handleDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Supprimer
        </button>
      </div>

      <ProductForm
        initial={{
          name: product.name,
          description: product.description,
          base_price: Number(product.base_price),
          compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
          stock: product.stock,
          weight: product.weight ? Number(product.weight) : null,
          gender: product.gender,
          is_active: product.is_active,
          is_featured: product.is_featured,
          is_new: product.is_new,
        }}
        onSubmit={handleSubmit}
        submitLabel="Mettre à jour"
      />
    </div>
  );
}