"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  fetchProducts,
  ApiProduct,
} from "../../lib/api/products";


export default function ProductsPage() {

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    fetchProducts()
      .then((res) => setProducts(res.items))
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);


  return (
    <div>

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-2xl font-semibold">
          Produits
        </h1>


        <Link
          href="/products/new"
          className="
            rounded-lg
            bg-neutral-900
            px-4
            py-2
            text-sm
            text-white
          "
        >
          + Nouveau produit
        </Link>

      </div>


      {loading ? (

        <p>Chargement...</p>

      ) : (

        <table className="w-full overflow-hidden rounded-xl border bg-white text-sm">

          <thead className="bg-neutral-50 text-left text-neutral-500">

            <tr>

              <th className="p-4">Nom</th>

              <th className="p-4">SKU</th>

              <th className="p-4">Prix</th>

              <th className="p-4">Stock</th>

              <th className="p-4">Genre</th>

              <th className="p-4">Statut</th>

            </tr>

          </thead>


          <tbody>

            {products.map((p) => (

              <tr
                key={p.id}
                className="border-t"
              >

                <td className="p-4">

                  <Link
                    href={`/products/${p.id}`}
                    className="hover:underline"
                  >
                    {p.name}
                  </Link>

                </td>


                <td className="p-4 text-neutral-500">
                  {p.sku}
                </td>


                <td className="p-4">
                  {Number(p.base_price).toLocaleString("fr-FR")} DA
                </td>


                <td className="p-4">
                  {p.stock}
                </td>


                <td className="p-4">
                  {p.gender ?? "—"}
                </td>


                <td className="p-4">

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      ${
                        p.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }
                    `}
                  >
                    {p.is_active ? "Actif" : "Inactif"}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}