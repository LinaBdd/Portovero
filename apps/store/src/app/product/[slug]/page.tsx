import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Truck, MessageCircle, Star } from "lucide-react";

import { getFullProduct } from "../../../lib/api/products";
import { ApiError } from "../../../lib/api/client";
import { getAllImages } from "../../../lib/product-helper";

import { ProductGallery, ProductInfo } from "../../../components/product";
import { WishlistButton } from "../../../components/product/WishlistButton";
import { RelatedProducts } from "../../../components/collection/RelatedProducts";
import { ProductTabs } from "../../../components/product/ProductTabs";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product;

  try {
    product = await getFullProduct(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      notFound();
    }

    throw e;
  }

  const hasRating = (product.rating ?? 0) > 0;

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1500px] px-5 pt-7 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8A8176]"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[#172B3A]"
          >
            Home
          </Link>

          <span className="text-[#B89B5E]">/</span>

          <Link
            href="/shop"
            className="transition-colors hover:text-[#172B3A]"
          >
            Shop
          </Link>

          
        </nav>
      </div>

      {/* Main product */}
      <section className="mx-auto max-w-[1500px] px-5 pb-24 pt-8 sm:px-8 lg:px-12 lg:pb-32 lg:pt-12">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.8fr)] lg:gap-20 xl:gap-28">

          {/* Product gallery */}
          <div className="min-w-0">
            <ProductGallery
              images={getAllImages(product)}
              name={product.name}
            />
          </div>

          {/* Product information */}
          <div className="lg:sticky lg:top-28">

            {/* Product title + wishlist */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-6">

                <h1 className="max-w-xl font-heading text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-[#172B3A] sm:text-5xl">
                  {product.name}
                </h1>

                <div className="pt-1">
                  <WishlistButton product={product} />
                </div>

              </div>

              {/* Rating */}
              {hasRating && (
                <div className="mt-5 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < Math.round(product.rating ?? 0)
                            ? "fill-[#B89B5E] text-[#B89B5E]"
                            : "fill-transparent text-[#D8CFC0]"
                        }
                      />
                    ))}
                  </div>

                  <span className="text-xs text-[#81786D]">
                    {product.rating?.toFixed(1)} · {product.reviews ?? 0} avis
                    
                  </span>
                </div>
              )}
            </div>

            {/* Product price / variants / cart */}
            <div className="mb-10">
              <ProductInfo product={product} />
            </div>

            {/* Service information */}
            <div className="space-y-6 pt-2">

              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EDE5DA] text-[#B89B5E]">
                  <ShieldCheck size={16} />
                </span>

                <div>
                  <p className="text-sm font-medium text-[#172B3A]">
                    Carefully selected
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-[#81786D]">
                    Timeless pieces selected for their quality and character.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EDE5DA] text-[#B89B5E]">
                  <Truck size={16} />
                </span>

                <div>
                  <p className="text-sm font-medium text-[#172B3A]">
                    Simple & secure ordering
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-[#81786D]">
                    A smooth shopping experience from selection to delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EDE5DA] text-[#B89B5E]">
                  <MessageCircle size={16} />
                </span>

                <div>
                  <p className="text-sm font-medium text-[#172B3A]">
                    We're here for you
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-[#81786D]">
                    Our team is available if you need help with your order.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Product details */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <ProductTabs product={product} />
      </section>

      {/* Related products */}
      <section className="bg-[#EDE5DA]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">

          <div className="mb-14 text-center">

            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#B89B5E]">
              You may also like
            </p>

            <h2 className="font-heading text-3xl font-medium tracking-[-0.025em] text-[#172B3A] sm:text-4xl">
              Complete the look
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#81786D]">
              Discover other pieces that complement your style.
            </p>

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
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-2xl bg-[#E4DACB]" />

          <div className="mt-4 h-3 w-3/4 rounded bg-[#E4DACB]" />

          <div className="mt-2 h-3 w-1/2 rounded bg-[#E4DACB]" />
        </div>
      ))}
    </div>
  );
}