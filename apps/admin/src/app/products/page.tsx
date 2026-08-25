"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import {
  fetchProducts,
  ApiProduct,
} from "../../lib/api/products";

type Filter = "all" | "active" | "inactive" | "low_stock" | "out_of_stock";

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);

      const res = await fetchProducts();

      setProducts(res.items);
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    } finally {
      setLoading(false);
    }
  }

  function getProductStock(product: ApiProduct): number {
  return product.colors.reduce((total, productColor) => {
    return (
      total +
      productColor.variants.reduce((variantTotal, variant) => {
        return variantTotal + Number(variant.stock || 0);
      }, 0)
    );
  }, 0);
 }

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch) ||
        (product.gender ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      let matchesFilter = true;

      switch (filter) {
        case "active":
          matchesFilter = product.is_active;
          break;

        case "inactive":
          matchesFilter = !product.is_active;
          break;

        case "low_stock":{
          const stock = getProductStock(product);
          matchesFilter =
            stock > 0 && stock <= 5;
          break;
        }
        case "out_of_stock":{
          const stock = getProductStock(product);
          matchesFilter = stock === 0;
          break;
        }
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const stats = useMemo(() => {
  const total = products.length;

  const active = products.filter(
    (product) => product.is_active
  ).length;

  const inactive = total - active;

  const lowStock = products.filter((product) => {
    const stock = getProductStock(product);
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStock = products.filter((product) => {
    const stock = getProductStock(product);
    return stock === 0;
  }).length;

  const totalStock = products.reduce(
    (sum, product) => sum + getProductStock(product),
    0
  );

  return {
    total,
    active,
    inactive,
    lowStock,
    outOfStock,
    totalStock,
  };
 }, [products]);

  function getStockStatus(stock: number) {
    if (stock === 0) {
      return {
        label: "Rupture",
        className:
          "bg-red-50 text-red-700 ring-red-200",
        icon: XCircle,
      };
    }

    if (stock <= 5) {
      return {
        label: "Stock faible",
        className:
          "bg-amber-50 text-amber-700 ring-amber-200",
        icon: AlertTriangle,
      };
    }

    return {
      label: "En stock",
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-200",
      icon: CheckCircle2,
    };
  }

  return (
    <div className="min-h-full bg-neutral-50/50">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm">
                <Package size={21} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Produits
                </h1>

                <p className="mt-0.5 text-sm text-neutral-500">
                  Gérez votre catalogue, vos prix et vos stocks.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/products/new"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-neutral-900
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-neutral-800
              hover:shadow
            "
          >
            <Plus size={17} />
            Nouveau produit
          </Link>
        </div>

        {/* STATISTICS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            label="Total produits"
            value={stats.total}
            icon={<Package size={18} />}
            iconClass="bg-neutral-100 text-neutral-700"
          />

          <StatCard
            label="Actifs"
            value={stats.active}
            icon={<CheckCircle2 size={18} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Inactifs"
            value={stats.inactive}
            icon={<XCircle size={18} />}
            iconClass="bg-neutral-100 text-neutral-500"
          />

          <StatCard
            label="Stock faible"
            value={stats.lowStock}
            icon={<AlertTriangle size={18} />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Stock total"
            value={stats.totalStock}
            icon={<Package size={18} />}
            iconClass="bg-blue-50 text-blue-600"
          />
        </div>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

          {/* TOOLBAR */}
          <div className="border-b border-neutral-200 p-4 sm:p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  type="text"
                  placeholder="Rechercher un produit, SKU..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    transition
                    placeholder:text-neutral-400
                    focus:border-neutral-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-neutral-900/5
                  "
                />
              </div>

              {/* FILTERS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">

                <div className="mr-1 hidden items-center gap-2 text-sm text-neutral-500 sm:flex">
                  <SlidersHorizontal size={16} />
                  Filtrer
                </div>

                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  Tous
                </FilterButton>

                <FilterButton
                  active={filter === "active"}
                  onClick={() => setFilter("active")}
                >
                  Actifs
                </FilterButton>

                <FilterButton
                  active={filter === "inactive"}
                  onClick={() => setFilter("inactive")}
                >
                  Inactifs
                </FilterButton>

                <FilterButton
                  active={filter === "low_stock"}
                  onClick={() => setFilter("low_stock")}
                >
                  Stock faible
                </FilterButton>

                <FilterButton
                  active={filter === "out_of_stock"}
                  onClick={() =>
                    setFilter("out_of_stock")
                  }
                >
                  Rupture
                </FilterButton>
              </div>
            </div>

            {/* RESULTS INFO */}
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
              <span>
                {filteredProducts.length} produit
                {filteredProducts.length !== 1 ? "s" : ""}
                affiché
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="font-medium text-neutral-700 hover:underline"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="divide-y divide-neutral-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4 p-5"
                >
                  <div className="h-12 w-12 rounded-xl bg-neutral-100" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-neutral-100" />
                    <div className="h-3 w-24 rounded bg-neutral-100" />
                  </div>

                  <div className="hidden h-4 w-20 rounded bg-neutral-100 sm:block" />
                  <div className="hidden h-4 w-16 rounded bg-neutral-100 md:block" />
                </div>
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredProducts.length === 0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                <Package size={25} />
              </div>

              <h3 className="font-medium text-neutral-900">
                Aucun produit trouvé
              </h3>

              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Aucun produit ne correspond à votre recherche ou
                aux filtres sélectionnés.
              </p>

              {(search || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-4 text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          {/* DESKTOP TABLE */}
          {!loading && filteredProducts.length > 0 && (
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/70 text-left">

                    <th className="px-5 py-3.5 font-medium text-neutral-500">
                      Produit
                    </th>

                    <th className="px-5 py-3.5 font-medium text-neutral-500">
                      SKU
                    </th>

                    <th className="px-5 py-3.5 font-medium text-neutral-500">
                      Prix
                    </th>

                    <th className="px-5 py-3.5 font-medium text-neutral-500">
                      Stock
                    </th>

                    <th className="px-5 py-3.5 font-medium text-neutral-500">
                      Genre
                    </th>

                    <th className="px-5 py-3.5 font-medium text-neutral-500">
                      Statut
                    </th>

                    <th className="w-10 px-5 py-3.5" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">

                  {filteredProducts.map((product) => {
                    const productStock = getProductStock(product);

                    const stockStatus =
                      getStockStatus(productStock);

                    const StockIcon =
                      stockStatus.icon;

                    return (
                      <tr
                        key={product.id}
                        className="
                          group
                          transition
                          hover:bg-neutral-50/70
                        "
                      >

                        {/* PRODUCT */}
                        <td className="px-5 py-4">

                          <Link
                            href={`/products/${product.id}`}
                            className="flex items-center gap-3"
                          >

                            <div className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-neutral-100
                              text-neutral-500
                              transition
                              group-hover:bg-neutral-200
                            ">
                              <Package size={18} />
                            </div>

                            <div className="min-w-0">

                              <p className="
                                truncate
                                font-medium
                                text-neutral-900
                                transition
                                group-hover:text-neutral-600
                              ">
                                {product.name}
                              </p>

                              <p className="mt-0.5 text-xs text-neutral-400">
                                ID #{product.id}
                              </p>

                            </div>

                          </Link>

                        </td>

                        {/* SKU */}
                        <td className="px-5 py-4">

                          <span className="
                            rounded-md
                            bg-neutral-100
                            px-2
                            py-1
                            font-mono
                            text-xs
                            text-neutral-600
                          ">
                            {product.sku}
                          </span>

                        </td>

                        {/* PRICE */}
                        <td className="px-5 py-4">

                          <div>
                            <p className="font-medium text-neutral-900">
                              {Number(
                                product.base_price
                              ).toLocaleString("fr-FR")}{" "}
                              DA
                            </p>

                            {product.compare_at_price &&
                              Number(
                                product.compare_at_price
                              ) >
                                Number(
                                  product.base_price
                                ) && (
                                <p className="text-xs text-neutral-400 line-through">
                                  {Number(
                                    product.compare_at_price
                                  ).toLocaleString(
                                    "fr-FR"
                                  )}{" "}
                                  DA
                                </p>
                              )}
                          </div>

                        </td>

                        {/* STOCK */}
                        <td className="px-5 py-4">

                          <div className="flex flex-col gap-1.5">

                            <div className="flex items-center gap-2">

                              <span className="font-medium text-neutral-900">
                                {productStock}
                              </span>

                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  gap-1
                                  rounded-full
                                  px-2
                                  py-0.5
                                  text-[11px]
                                  font-medium
                                  ring-1
                                  ring-inset
                                  ${stockStatus.className}
                                `}
                              >
                                <StockIcon size={11} />
                                {stockStatus.label}
                              </span>

                            </div>

                            {productStock <= 5 && (
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-100">
                                <div
                                  className={`
                                    h-full rounded-full
                                    ${
                                      productStock === 0
                                        ? "w-0 bg-red-500"
                                        : productStock <= 2
                                        ? "w-1/4 bg-red-500"
                                        : "w-1/2 bg-amber-500"
                                    }
                                  `}
                                />
                              </div>
                            )}

                          </div>

                        </td>

                        {/* GENDER */}
                        <td className="px-5 py-4">

                          <span className="text-neutral-600">
                            {product.gender ?? "—"}
                          </span>

                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              ${
                                product.is_active
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                  : "bg-neutral-100 text-neutral-500 ring-1 ring-inset ring-neutral-200"
                              }
                            `}
                          >

                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  product.is_active
                                    ? "bg-emerald-500"
                                    : "bg-neutral-400"
                                }
                              `}
                            />

                            {product.is_active
                              ? "Actif"
                              : "Inactif"}

                          </span>

                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">

                          <Link
                            href={`/products/${product.id}`}
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              text-neutral-400
                              transition
                              hover:bg-neutral-100
                              hover:text-neutral-900
                            "
                          >
                            <ChevronRight size={17} />
                          </Link>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          )}

          {/* MOBILE CARDS */}
          {!loading && filteredProducts.length > 0 && (
            <div className="divide-y divide-neutral-100 md:hidden">

              {filteredProducts.map((product) => {
                const productStock = getProductStock(product);

                const stockStatus =
                  getStockStatus(productStock);

                const StockIcon =
                  stockStatus.icon;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="
                      block
                      p-4
                      transition
                      hover:bg-neutral-50
                    "
                  >

                    <div className="flex gap-3">

                      <div className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-neutral-100
                        text-neutral-500
                      ">
                        <Package size={19} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <h3 className="truncate font-medium text-neutral-900">
                              {product.name}
                            </h3>

                            <p className="mt-0.5 font-mono text-xs text-neutral-400">
                              {product.sku}
                            </p>

                          </div>

                          <ChevronRight
                            size={18}
                            className="shrink-0 text-neutral-400"
                          />

                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          <span className="font-medium text-neutral-900">
                            {Number(
                              product.base_price
                            ).toLocaleString("fr-FR")}{" "}
                            DA
                          </span>

                          <span className="text-neutral-300">
                            •
                          </span>

                          <span className="text-sm text-neutral-500">
                            Stock : {productStock}
                          </span>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              rounded-full
                              px-2
                              py-0.5
                              text-[11px]
                              font-medium
                              ring-1
                              ring-inset
                              ${stockStatus.className}
                            `}
                          >
                            <StockIcon size={11} />
                            {stockStatus.label}
                          </span>

                        </div>

                        <div className="mt-3 flex items-center justify-between">

                          <span className="text-xs text-neutral-500">
                            {product.gender ?? "Genre non défini"}
                          </span>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              ${
                                product.is_active
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-neutral-100 text-neutral-500"
                              }
                            `}
                          >
                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  product.is_active
                                    ? "bg-emerald-500"
                                    : "bg-neutral-400"
                                }
                              `}
                            />

                            {product.is_active
                              ? "Actif"
                              : "Inactif"}
                          </span>

                        </div>

                      </div>

                    </div>

                  </Link>
                );
              })}

            </div>
          )}

          {/* FOOTER */}
          {!loading && filteredProducts.length > 0 && (
            <div className="
              flex
              items-center
              justify-between
              border-t
              border-neutral-200
              bg-neutral-50/50
              px-5
              py-3
              text-xs
              text-neutral-500
            ">
              <span>
                {filteredProducts.length} sur{" "}
                {products.length} produits
              </span>

              <span>
                Stock total :{" "}
                <strong className="font-medium text-neutral-700">
                  {stats.totalStock}
                </strong>
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="
      rounded-2xl
      border
      border-neutral-200
      bg-white
      p-5
      shadow-sm
      transition
      hover:-translate-y-0.5
      hover:shadow-md
    ">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-neutral-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
            {value.toLocaleString("fr-FR")}
          </p>
        </div>

        <div
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

/* ============================================================
   FILTER BUTTON
============================================================ */

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        shrink-0
        rounded-lg
        px-3
        py-2
        text-xs
        font-medium
        transition
        ${
          active
            ? "bg-neutral-900 text-white shadow-sm"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }
      `}
    >
      {children}
    </button>
  );
}