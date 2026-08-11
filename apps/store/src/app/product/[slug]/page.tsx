import { notFound } from "next/navigation";
import { getFullProduct } from "../../../lib/api/products";
import { ApiError } from "../../../lib/api/client";
import { getAllImages } from "../../../lib/product-helper";

import { ProductGallery, ProductInfo } from "../../../components/product";
import { RelatedProducts } from "../../../components/collection/RelatedProducts";
import { ProductTabs } from "../../../components/product/ProductTabs";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    product = await getFullProduct(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-20 lg:grid-cols-2">
        <ProductGallery images={getAllImages(product)} name={product.name} />
        <ProductInfo product={product} />
      </div>
      <ProductTabs product={product} />
      <RelatedProducts currentProduct={product} />
    </main>
  );
}