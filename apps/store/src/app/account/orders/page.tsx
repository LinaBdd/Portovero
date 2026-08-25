
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import { fetchMyOrders, type ApiOrder } from "../../../lib/api/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError("Impossible de charger vos commandes.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] text-[#172B3A]">
        <section className="mx-auto max-w-[1200px] px-6 pb-24 pt-16 sm:px-8 lg:px-12 lg:pt-24">
          
          <div className="border-b border-[#DCD5CA] pb-10">
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#A68B57]">
              Portovero
            </p>

            <h1 className="font-heading text-5xl font-medium tracking-[-0.045em] sm:text-6xl">
              Mes commandes
            </h1>
          </div>

          <div className="mt-10 divide-y divide-[#DCD5CA] border-y border-[#DCD5CA]">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-7"
              >
                <div className="space-y-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#E8E1D7]" />
                  <div className="h-5 w-32 animate-pulse rounded bg-[#E8E1D7]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[#E8E1D7]" />
                </div>

                <div className="space-y-3">
                  <div className="ml-auto h-3 w-16 animate-pulse rounded bg-[#E8E1D7]" />
                  <div className="ml-auto h-4 w-24 animate-pulse rounded bg-[#E8E1D7]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#172B3A]">

      {/* Header */}
      <section className="mx-auto max-w-[1200px] px-6 pb-12 pt-16 sm:px-8 lg:px-12 lg:pt-24">

        <div className="border-b border-[#DCD5CA] pb-10">

          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#A68B57]">
            Mon compte
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="font-heading text-5xl font-medium tracking-[-0.045em] sm:text-6xl">
                Mes commandes
              </h1>

              <p className="mt-4 text-sm text-[#766F66]">
                Retrouvez l'historique et le suivi de vos commandes.
              </p>
            </div>

            {orders.length > 0 && (
              <p className="text-xs text-[#8A837A]">
                {orders.length}{" "}
                {orders.length === 1 ? "commande" : "commandes"}
              </p>
            )}

          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 sm:px-8 lg:px-12">

        {error && (
          <div className="border-y border-red-200 py-5">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="py-24 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E9E1D5]">
              <ShoppingBag
                size={21}
                strokeWidth={1.3}
                className="text-[#A68B57]"
              />
            </div>

            <h2 className="mt-7 font-heading text-2xl font-medium">
              Aucune commande
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#8A837A]">
              Vous n'avez pas encore passé de commande.
              Découvrez notre sélection et trouvez votre prochaine pièce.
            </p>

            <Link
              href="/shop"
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                border-b
                border-[#172B3A]
                pb-1
                text-sm
                font-medium
                transition-colors
                hover:border-[#A68B57]
                hover:text-[#A68B57]
              "
            >
              Découvrir la collection
              <ArrowRight size={15} strokeWidth={1.4} />
            </Link>

          </div>
        )}

        {orders.length > 0 && (
          <div className="divide-y divide-[#DCD5CA] border-y border-[#DCD5CA]">

            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="
                  group
                  block
                  py-7
                  transition-colors
                  hover:bg-[#F3EEE6]
                  sm:px-5
                "
              >
                <div className="flex items-center justify-between gap-6">

                  {/* Left */}
                  <div className="flex items-start gap-5">

                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1D5]">
                      <Package
                        size={17}
                        strokeWidth={1.4}
                        className="text-[#A68B57]"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68B57]">
                        Commande
                      </p>

                      <h2 className="mt-1 font-heading text-xl font-medium">
                        #{order.id}
                      </h2>

                      <p className="mt-2 text-xs text-[#8A837A]">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString("fr-DZ")}
                      </p>
                    </div>

                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-6">

                    <div className="hidden text-right sm:block">

                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#8A837A]">
                        Statut
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {order.status}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#8A837A]">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {Number(order.total ?? 0).toLocaleString(
                          "fr-DZ"
                        )}{" "}
                        DA
                      </p>

                    </div>

                    <ArrowRight
                      size={17}
                      strokeWidth={1.4}
                      className="
                        hidden
                        text-[#A68B57]
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        sm:block
                      "
                    />

                  </div>

                </div>

                {/* Mobile status */}
                <div className="mt-5 flex items-center justify-between border-t border-[#E4DED4] pt-4 sm:hidden">

                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#8A837A]">
                    Statut
                  </span>

                  <span className="text-xs font-medium">
                    {order.status}
                  </span>

                </div>

              </Link>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}
