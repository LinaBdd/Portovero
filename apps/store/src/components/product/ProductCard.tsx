import Link from "next/link";

import { Product } from "../../types/product";
import { ProductActions } from "./ProductActions";
import { ProductImage } from "./ProductImage";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <article className="group">

      <div className="relative">

        <Link href={`/product/${product.slug}`}>

          <ProductImage
            image={product.images[0]}
            hoverImage={product.images[1] ?? product.images[0]}
            isNew={product.newArrival}
            isSale={!!product.oldPrice}
          />

        </Link>

        <ProductActions />

      </div>

      <div className="mt-5 space-y-2">

        <p className="text-sm uppercase tracking-widest text-neutral-500">
             {product.gender} • {product.category}
        </p>

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold transition hover:text-[#C8A96A]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">

          <span className="font-semibold">
            {product.price.toLocaleString("fr-FR")} DA
          </span>

          {product.oldPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {product.oldPrice.toLocaleString("fr-FR")} DA
            </span>
          )}

        </div>

        <div className="text-sm text-neutral-500">
          ⭐ {product.rating} ({product.reviews} avis)
        </div>

      </div>

    </article>
  );
}