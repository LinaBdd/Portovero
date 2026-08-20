"use client";

import { useRouter } from "next/navigation";

import {
  ProductForm,
} from "../../../components/ProductForm";

import {
  createProduct,
  ProductPayload,
} from "../../../lib/api/products";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(data: ProductPayload) {
    const product = await createProduct(data);

    router.push(`/products/${product.id}`);
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">
        Nouveau produit
      </h1>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Créer le produit"
      />
    </div>
  );
}