import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getFullProduct } from "../../../lib/api/products";
import { getSettings } from "../../../lib/api/site";
import { ApiError } from "../../../lib/api/client";
import { heading, sans } from "../../../lib/fonts";

import { ProductDetail } from "../../../components/product/ProductDetail";
import { ProductTabs } from "../../../components/product/ProductTabs";
import { RelatedProducts } from "../../../components/collection/RelatedProducts";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const settings = await getSettings();
  let product;

  try {
    product = await getFullProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <main className={`${sans.className} min-h-screen bg-[#F7F3EC] text-[#172B3A]`}>
      {/* Fil d'Ariane */}
      <div className="mx-auto max-w-[1400px] px-5 pt-7 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8A8176]"
        >
          <Link href="/" className="transition-colors hover:text-[#172B3A]">
            Home
          </Link>
          <span className="text-[#B89B5E]">/</span>
          <Link href="/shop" className="transition-colors hover:text-[#172B3A]">
            Shop
          </Link>
          <span className="text-[#B89B5E]">/</span>
          <span className="max-w-[180px] truncate text-[#A69D91]">{product.name}</span>
        </nav>
      </div>

      {/* Produit */}
      <section className="mx-auto max-w-[1400px] px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28 lg:pt-12">
        <ProductDetail product={product} />
      </section>

      {/* Détails */}
      <section className="mx-auto max-w-[1100px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <ProductTabs
          product={product}
          shippingInfo={settings.shipping_info}
          returnsInfo={settings.returns_info}
        />
      </section>

      {/* Suggestions */}
      <section className="bg-[#EDE5DA]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-14 text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#B89B5E]">
              Vous aimerez aussi
            </p>
            <h2
              className={`${heading.className} text-4xl font-medium tracking-[-0.02em] text-[#172B3A] sm:text-5xl`}
            >
              Complétez le look
            </h2>
          </div>

          <Suspense fallback={<RelatedProductsSkeleton />}>
            <RelatedProducts currentProduct={product} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[3/4] rounded-2xl bg-[#E4DACB]" />
          <div className="mt-4 h-3 w-3/4 rounded bg-[#E4DACB]" />
          <div className="mt-2 h-3 w-1/2 rounded bg-[#E4DACB]" />
        </div>
      ))}
    </div>
  );
}