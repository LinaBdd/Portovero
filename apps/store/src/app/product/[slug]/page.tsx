import { notFound } from "next/navigation";

import { products } from "../../../data/products";

import {
  ProductGallery,
  ProductInfo,
} from "../../../components/product";

import { RelatedProducts } from "../../../components/collection/RelatedProducts";
import { ProductTabs } from "../../../components/product/ProductTabs";
import { Navbar } from "../../../components/navigation";
import { Footer } from "../../../components/footer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = products.find(
    (p) => p.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-20 lg:grid-cols-2">

          <ProductGallery
            images={product.images}
            name={product.name}
          />

          <ProductInfo
            product={product}
          />

        </div>

        <ProductTabs product={product} />

        <RelatedProducts
          currentProduct={product}
        />

      </main>

      <Footer />

    </>
  );
}