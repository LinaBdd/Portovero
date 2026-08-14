"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  fetchProductList,
  adaptToListProduct,
  fetchCategories,
  type Category,
  fetchFilteredProducts,
} from "../../lib/api/products";

import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../lib/api/wishlist";

import { getImageUrl } from "../../lib/utils";
import { useAuth } from "../../store/auth";

import type { Product } from "../../types/product";
import type { ShopFilters } from "./FilterSidebar";

interface ProductGridProps {
  search: string;
  sort: string;
  filters: ShopFilters;
}

// ============================================================
// WISHLIST BUTTON
// ============================================================

function WishlistButton({
  productId,
  userId,
  liked,
  onToggle,
}: {
  productId: number;
  userId: number | null;
  liked: boolean;
  onToggle: (
    productId: number,
    liked: boolean
  ) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userId) {
      alert(
        "Veuillez vous connecter pour ajouter un produit à votre wishlist."
      );
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      await onToggle(productId, liked);
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={
        liked
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      onClick={handleWishlist}
      disabled={loading}
      className="
        absolute right-4 top-4 z-20
        flex h-10 w-10
        items-center justify-center
        rounded-full
        bg-white/95
        shadow-sm
        transition-all
        duration-300
        hover:scale-110
        disabled:cursor-wait
        disabled:opacity-60
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition-colors duration-200 ${
          liked
            ? "fill-black stroke-black"
            : "fill-none stroke-black"
        }`}
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        />
      </svg>
    </button>
  );
}

// ============================================================
// PRODUCT GRID
// ============================================================

export function ProductGrid({
  search,
  sort,
  filters,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [wishlistIds, setWishlistIds] =
    useState<Set<number>>(new Set());

  const user = useAuth((state) => state.user);

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  useEffect(() => {
  let cancelled = false;

  async function loadProducts() {
    try {
      setLoading(true);

      let response;

      const genders = filters.gender;
      const categories = filters.category;

      // Aucun filtre
      if (
        genders.length === 0 &&
        categories.length === 0
      ) {
        response = await fetchProductList(0, 100);
      }

      // Filtres backend
      else {
        /*
         * Le backend accepte une seule valeur
         * de gender/category par requête.
         *
         * On récupère donc les résultats pour
         * chaque combinaison sélectionnée puis
         * on fusionne les produits.
         */
        const requests: Promise<any>[] = [];

        const genderValues =
          genders.length > 0 ? genders : [undefined];

        const categoryValues =
          categories.length > 0
            ? categories
            : [undefined];

        for (const gender of genderValues) {
          for (const category of categoryValues) {
            requests.push(
              fetchFilteredProducts(
                gender,
                category,
                0,
                100
              )
            );
          }
        }

        const responses = await Promise.all(
          requests
        );

        const uniqueProducts = new Map<
          number,
          any
        >();

        for (const result of responses) {
          for (const product of result.items ?? []) {
            uniqueProducts.set(
              product.id,
              product
            );
          }
        }

        response = {
          total: uniqueProducts.size,
          items: Array.from(
            uniqueProducts.values()
          ),
        };
      }

      if (cancelled) return;

      if (
        !response ||
        !Array.isArray(response.items)
      ) {
        setProducts([]);
        return;
      }

      const adaptedProducts =
        response.items.map(
          adaptToListProduct
        );

      setProducts(adaptedProducts);

    } catch (error) {
      console.error(
        "❌ Failed to load products:",
        error
      );

      if (!cancelled) {
        setProducts([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadProducts();

  return () => {
    cancelled = true;
  };
}, [
  filters.gender,
  filters.category,
]);

  // ============================================================
  // LOAD WISHLIST
  // ============================================================

  useEffect(() => {
    async function loadWishlist() {
      if (!user?.id) {
        setWishlistIds(new Set());
        return;
      }

      try {
        const wishlist =
          await fetchWishlist();

        const ids = new Set(
          wishlist.map(
            (item) => item.product_id
          )
        );

        setWishlistIds(ids);
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error
        );

        setWishlistIds(new Set());
      }
    }

    loadWishlist();
  }, [user?.id]);

  // ============================================================
  // TOGGLE WISHLIST
  // ============================================================

  const handleWishlistToggle = async (
    productId: number,
    currentlyLiked: boolean
  ) => {
    if (!user?.id) return;

    if (currentlyLiked) {
      await removeFromWishlist(productId);

      setWishlistIds((current) => {
        const next = new Set(current);
        next.delete(productId);
        return next;
      });
    } else {
      await addToWishlist(productId);

      setWishlistIds((current) => {
        const next = new Set(current);
        next.add(productId);
        return next;
      });
    }
  };

  // ============================================================
  // SEARCH + FILTERS
  // ============================================================

  const filteredProducts = products.filter((product) => {
  const query = search.trim().toLowerCase();

  if (
    query &&
    !product.name.toLowerCase().includes(query) &&
    !product.description.toLowerCase().includes(query)
  ) {
    return false;
  }

  return true;
});

  // ============================================================
  // SORT
  // ============================================================

  const sortedProducts =
    [...filteredProducts].sort(
      (a, b) => {
        switch (sort) {
          case "price_asc":
            return (
              Number(a.base_price) -
              Number(b.base_price)
            );

          case "price_desc":
            return (
              Number(b.base_price) -
              Number(a.base_price)
            );

          case "newest":
            return (
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
            );

          default:
            return 0;
        }
      }
    );

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="aspect-[3/4] animate-pulse bg-neutral-100"
            />
          )
        )}
      </div>
    );
  }

  // ============================================================
  // EMPTY
  // ============================================================

  if (sortedProducts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-neutral-500">
          No products found.
        </p>
      </div>
    );
  }

  // ============================================================
  // PRODUCTS
  // ============================================================

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {sortedProducts.map((product) => {
        const imagePath =
          product.images?.[0];

        const imageUrl =
          getImageUrl(imagePath);

        const liked =
          wishlistIds.has(
            Number(product.id)
          );

        return (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="group block"
          >
            <article>
              {/* IMAGE */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    No image
                  </div>
                )}

                {/* NEW BADGE */}
                {product.is_new && (
                  <span className="absolute left-3 top-3 z-10 bg-white px-3 py-1 text-xs tracking-wide">
                    New
                  </span>
                )}

                {/* WISHLIST */}
                <WishlistButton
                  productId={Number(
                    product.id
                  )}
                  userId={
                    user?.id ?? null
                  }
                  liked={liked}
                  onToggle={
                    handleWishlistToggle
                  }
                />
              </div>

              {/* INFO */}
              <div className="mt-4">
                <h3 className="font-serif text-lg transition-opacity duration-200 group-hover:opacity-70">
                  {product.name}
                </h3>

                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm">
                    {Number(
                      product.base_price
                    ).toLocaleString(
                      "fr-DZ"
                    )}{" "}
                    DA
                  </span>

                  {product.compare_at_price !==
                    null &&
                    Number(
                      product.compare_at_price
                    ) >
                      Number(
                        product.base_price
                      ) && (
                      <span className="text-sm text-neutral-400 line-through">
                        {Number(
                          product.compare_at_price
                        ).toLocaleString(
                          "fr-DZ"
                        )}{" "}
                        DA
                      </span>
                    )}
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}