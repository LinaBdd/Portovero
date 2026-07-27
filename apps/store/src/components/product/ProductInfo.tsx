"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Product } from "../../types/product";
import { useCart } from "../../store/cart";

import { Button } from "../ui/button";
import { ColorSelector } from "./ColorSelector";
import { QuantitySelector } from "./QuantitySelector";
import { SizeSelector } from "./SizeSelector";

type Props = {
  product: Product;
};

export function ProductInfo({ product }: Props) {
  const { add } = useCart();

  const [quantity, setQuantity] = useState(1);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : null;

  const handleAddToCart = () => {
   add(product, quantity);

   toast.success("Produit ajouté au panier", {
    description: product.name,
   });
  };

  return (
    <div className="space-y-8">
      {/* Product Info */}

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

      {/* Price */}

      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold">
          {product.price.toLocaleString("fr-FR")} DA
        </span>

        {product.oldPrice && (
          <span className="text-lg text-neutral-400 line-through">
            {product.oldPrice.toLocaleString("fr-FR")} DA
          </span>
        )}

        {discount && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Options */}

      <ColorSelector colors={product.colors} />

      <SizeSelector sizes={product.sizes} />

      <QuantitySelector
        quantity={quantity}
        onChange={setQuantity}
      />

      {/* Stock */}

      <p className="text-sm font-medium text-green-700">
        ✓ {product.stock} articles en stock
      </p>

      {/* Add To Cart */}

      <Button
        variant="primary"
        className="h-14 w-full text-lg"
        onClick={handleAddToCart}
      >
        Ajouter au panier
      </Button>
    </div>
  );
}