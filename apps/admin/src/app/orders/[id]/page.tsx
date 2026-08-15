"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  fetchOrderDetail,
  updateOrderStatus,
  updatePaymentStatus,
  ApiOrderDetail,
} from "../../../lib/api/orders";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [order, setOrder] = useState<ApiOrderDetail | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      console.error("Invalid order ID:", params.id);
      return;
    }

    fetchOrderDetail(id)
      .then(setOrder)
      .catch(console.error);
  }, [id, params.id]);

  async function reloadOrder() {
    const updatedOrder = await fetchOrderDetail(id);
    setOrder(updatedOrder);
  }

  async function handleOrderStatusChange(status: string) {
    if (status === order?.status) return;

    setUpdatingOrder(true);

    try {
      await updateOrderStatus(id, status);
      await reloadOrder();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingOrder(false);
    }
  }

  async function handlePaymentStatusChange(status: string) {
    if (status === order?.payment_status) return;

    setUpdatingPayment(true);

    try {
      await updatePaymentStatus(id, status);
      await reloadOrder();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingPayment(false);
    }
  }

  if (!Number.isInteger(id) || id <= 0) {
    return <p>Commande invalide.</p>;
  }

  if (!order) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Commande #{order.id}
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Gestion de la commande et du paiement
        </p>
      </div>

      {/* STATUT COMMANDE */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-2 font-medium">
          Statut de la commande
        </h2>

        <p className="mb-5 text-sm text-neutral-500">
          Modifiez l'état actuel de la commande.
        </p>

        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              disabled={updatingOrder || updatingPayment}
              onClick={() => handleOrderStatusChange(status)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                order.status === status
                  ? "bg-neutral-900 text-white"
                  : "border bg-white hover:bg-neutral-50"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <div className="mt-5 border-t pt-4">
          <p className="text-sm text-neutral-500">
            Statut actuel
          </p>

          <p className="mt-1 font-medium">
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </p>
        </div>
      </div>

      {/* STATUT PAIEMENT */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-2 font-medium">
          Statut du paiement
        </h2>

        <p className="mb-5 text-sm text-neutral-500">
          Modifiez l'état du paiement de cette commande.
        </p>

        <div className="flex flex-wrap gap-2">
          {PAYMENT_STATUSES.map((status) => (
            <button
              key={status}
              disabled={updatingOrder || updatingPayment}
              onClick={() => handlePaymentStatusChange(status)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                order.payment_status === status
                  ? "bg-neutral-900 text-white"
                  : "border bg-white hover:bg-neutral-50"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {PAYMENT_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <div className="mt-5 border-t pt-4">
          <p className="text-sm text-neutral-500">
            Statut actuel
          </p>

          <p className="mt-1 font-medium">
            {PAYMENT_STATUS_LABELS[order.payment_status] ??
              order.payment_status}
          </p>
        </div>
      </div>

      {/* CLIENT */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-medium">
          Client
        </h2>

        <p>
          {order.first_name} {order.last_name}
        </p>

        <p className="text-neutral-500">
          {order.phone}
        </p>

        {order.email && (
          <p className="text-neutral-500">
            {order.email}
          </p>
        )}
      </div>

      {/* LIVRAISON */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-medium">
          Livraison
        </h2>

        <p>{order.address}</p>

        <p>
          {order.commune}, {order.wilaya}
        </p>

        <p className="mt-2 text-neutral-500">
          {order.shipping_method}
        </p>
      </div>

      {/* ARTICLES */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-medium">
          Articles
        </h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-3 text-sm"
            >
              <div>
                <p>{item.product_name}</p>

                <p className="text-neutral-500">
                  {item.color} · {item.size} · x{item.quantity}
                </p>
              </div>

              <p>
                {Number(item.total_price).toLocaleString("fr-FR")} DA
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Sous-total</span>

            <span>
              {Number(order.subtotal).toLocaleString("fr-FR")} DA
            </span>
          </div>

          <div className="flex justify-between">
            <span>Livraison</span>

            <span>
              {Number(order.shipping_cost).toLocaleString("fr-FR")} DA
            </span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total</span>

            <span>
              {Number(order.total).toLocaleString("fr-FR")} DA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}