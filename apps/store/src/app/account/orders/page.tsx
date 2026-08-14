"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="font-serif text-4xl">My Orders</h1>

        <div className="mt-10 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse bg-neutral-100"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
          Account
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
          My Orders
        </h1>
      </header>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!error && orders.length === 0 && (
        <div className="border border-neutral-200 py-20 text-center">
          <h2 className="font-serif text-2xl">
            No orders yet
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            You haven't placed an order yet.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-block bg-black px-8 py-3 text-sm text-white"
          >
            Discover the collection
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border border-neutral-200 p-6 transition hover:border-black"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-400">
                    Order
                  </p>

                  <h2 className="mt-1 font-serif text-xl">
                    #{order.id}
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    {new Date(order.created_at).toLocaleDateString(
                      "fr-DZ"
                    )}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm uppercase">
                    {order.status}
                  </p>

                  <p className="mt-2 font-medium">
                    {Number(order.total ?? 0).toLocaleString(
                      "fr-DZ"
                    )}{" "}
                    DA
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}