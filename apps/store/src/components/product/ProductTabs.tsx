"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { Product } from "../../types/product";
import { heading } from "../../lib/fonts";

type Props = {
  product: Product;
  shippingInfo?: string;
  returnsInfo?: string;
};

const TABS = [
  { id: "description", label: "Description" },
  { id: "shipping", label: "Livraison & retours" },
  { id: "reviews", label: "Avis" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProductTabs({ product, shippingInfo, returnsInfo }: Props) {
  const [tab, setTab] = useState<TabId>("description");

  const rating = Number.isFinite(Number(product.rating)) ? Number(product.rating) : 0;
  const reviews = Number.isFinite(Number(product.reviews)) ? Number(product.reviews) : 0;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Informations produit"
        className="flex gap-8 overflow-x-auto border-b border-[#172B3A]/10 sm:gap-12"

      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={active}
              aria-controls={`panel-${item.id}`}
              onClick={() => setTab(item.id)}
              className={`relative shrink-0 pb-4 text-sm tracking-wide transition-colors ${
                active ? "text-[#172B3A]" : "text-[#8A8176] hover:text-[#172B3A]"
              }`}
            >
              {item.label}
              <span
                className={`absolute inset-x-0 -bottom-px h-[2px] bg-[#172B3A] transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="pt-10"
      >

        {tab === "description" && (
          <p className="max-w-2xl text-[17px] leading-8 text-[#4F4A42]">
            {product.description || "Aucune description pour le moment."}
          </p>
        )}

        {tab === "shipping" && (
          <dl className="grid gap-8 sm:grid-cols-3">
            {[
              { term: "Livraison", text: shippingInfo },
              { term: "Retours", text: returnsInfo },
            ]
              .filter((row) => row.text)
              .map((row) => (
              <div key={row.term} className="border-t border-[#172B3A]/15 pt-5">
                <dt
                  className={`${heading.className} text-2xl font-medium text-[#172B3A]`}
                >
                  {row.term}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-[#81786D]">{row.text}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === "reviews" &&
          (reviews > 0 ? (
            <div className="flex items-center gap-6">
              <p className={`${heading.className} text-6xl font-medium text-[#172B3A]`}>
                {rating.toFixed(1)}
              </p>
              <div>

                <div className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(rating)
                          ? "fill-[#B89B5E] text-[#B89B5E]"
                          : "fill-transparent text-[#D8CFC0]"
                      }
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-[#81786D]">Basé sur {reviews} avis</p>
              </div>
            </div>
          ) : (
            <p className="text-[#81786D]">Aucun avis pour le moment.</p>
          ))}
      </div>
    </div>
  );
}