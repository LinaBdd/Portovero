"use client";

import { useState } from "react";

import { Product } from "../../types/product";

type Props = {
  product: Product;
};

export function ProductTabs({ product }: Props) {
  const [tab, setTab] = useState("description");

  return (
    <section className="mt-24">

      <div className="flex gap-10 border-b">

        {["description", "shipping", "reviews"].map((item) => (

          <button
            key={item}
            onClick={() => setTab(item)}
            className={`pb-4 capitalize ${
              tab === item
                ? "border-b-2 border-black font-semibold"
                : "text-neutral-500"
            }`}
          >
            {item}
          </button>

        ))}

      </div>

      <div className="mt-8">

        {tab === "description" && (

          <p className="max-w-3xl leading-8 text-neutral-600">
            {product.description}
          </p>

        )}

        {tab === "shipping" && (

          <div className="space-y-4 text-neutral-600">

            <p>
              Livraison partout en Algérie.
            </p>

            <p>
              Expédition sous 24 à 48 heures.
            </p>

            <p>
              Retour possible sous 14 jours.
            </p>

          </div>

        )}

        {tab === "reviews" && (

          <div>

            <h3 className="text-2xl font-semibold">

              {product.rating} ★

            </h3>

            <p className="mt-3 text-neutral-600">

              Basé sur {product.reviews} avis.

            </p>

          </div>

        )}

      </div>

    </section>
  );
}