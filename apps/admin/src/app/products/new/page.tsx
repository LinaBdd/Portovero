"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PackagePlus,
  Sparkles,
} from "lucide-react";

import { ProductForm } from "../../../components/ProductForm";
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
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* ================= HEADER ================= */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            />
            Produits
          </Link>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-lg shadow-neutral-900/10">
              <PackagePlus className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  Nouveau produit
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  <Sparkles className="h-3 w-3" />
                  Nouveau
                </span>
              </div>

              <p className="text-sm text-neutral-500">
                Ajoutez un produit et configurez son catalogue, ses prix
                et son stock.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          
          {/* ================= FORM ================= */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            
            {/* Card header */}
            <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-base font-semibold text-neutral-950">
                  Informations du produit
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Renseignez les informations nécessaires à la publication
                  du produit.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-7 sm:px-8 sm:py-8">
              <ProductForm
                onSubmit={handleSubmit}
                submitLabel="Créer le produit"
              />
            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="space-y-4">
            
            {/* Status card */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-neutral-950">
                Publication
              </h3>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Vérifiez les informations avant de créer le produit.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3.5 py-3">
                  <span className="text-xs text-neutral-500">
                    Produit
                  </span>

                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                    Brouillon
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3.5 py-3">
                  <span className="text-xs text-neutral-500">
                    Stock
                  </span>

                  <span className="text-xs font-medium text-neutral-900">
                    À configurer
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3.5 py-3">
                  <span className="text-xs text-neutral-500">
                    Prix
                  </span>

                  <span className="text-xs font-medium text-neutral-900">
                    À définir
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-neutral-200/80 bg-neutral-900 p-5 text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Sparkles className="h-4 w-4" />
              </div>

              <h3 className="text-sm font-semibold">
                Conseil
              </h3>

              <p className="mt-2 text-xs leading-5 text-neutral-300">
                Ajoutez des photos de qualité, un prix clair et configurez
                correctement les tailles et les couleurs pour faciliter
                la gestion du stock.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}