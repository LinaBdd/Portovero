import { Product } from "../../types/product";

import { Button } from "../ui/button";
import { ColorSelector } from "./ColorSelector";
import { QuantitySelector } from "./QuantitySelector";
import { SizeSelector } from "./SizeSelector";

type Props = {
  product: Product;
};

export function ProductInfo({ product }: Props) {
  return (
    <div className="space-y-8">

      <div>
        <p className="uppercase tracking-[0.25em] text-[#C8A96A]">
          {product.category} / {product.gender}
        </p>

        <h1 className="mt-3 text-5xl font-serif">
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-lg font-semibold">
            ⭐ {product.rating}
          </span>

          <span className="text-neutral-500">
            ({product.reviews} avis)
          </span>
        </div>

        <p className="mt-6 leading-8 text-neutral-600">
          {product.description}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <span className="text-3xl font-bold">
          {product.price.toLocaleString("fr-FR")} DA
        </span>

        {product.oldPrice && (
          <span className="text-lg text-neutral-400 line-through">
            {product.oldPrice.toLocaleString("fr-FR")} DA
          </span>
        )}

      </div>

      <ColorSelector colors={product.colors} />

      <SizeSelector sizes={product.sizes} />

      <QuantitySelector />

      <p className="text-sm text-green-700">
        {product.stock} articles en stock
      </p>

      <Button
        variant="primary"
        className="w-full h-14 text-lg"
      >
        Ajouter au panier
      </Button>

    </div>
  );
}