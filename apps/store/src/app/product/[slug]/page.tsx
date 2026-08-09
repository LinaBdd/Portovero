import { notFound } from "next/navigation";

import {
  ProductGallery,
  ProductInfo,
} from "../../../components/product";

import { RelatedProducts } from "../../../components/collection/RelatedProducts";
import { ProductTabs } from "../../../components/product/ProductTabs";
import { getProductBySlugForStore } from "../../../lib/api/products";
import { getImageUrl } from "../../../lib/image";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlugForStore(slug);

  if (!product) {
    notFound();
  }

  // Les images sont directement dans product.images
  const galleryImages = Array.isArray(product.images)
    ? product.images
        .filter(
          (image): image is string =>
            typeof image === "string" && image.trim().length > 0
        )
        .map((image) => getImageUrl(image))
        .filter(Boolean)
    : [];

  console.log("PRODUCT:", product);
  console.log("PRODUCT IMAGES:", product.images);
  console.log("GALLERY:", galleryImages);

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-20 lg:grid-cols-2">
        <ProductGallery
          images={galleryImages}
          name={product.name}
        />

        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      <RelatedProducts currentProduct={product} />
    </main>
  );
}