"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { apiClient } from "../../lib/api/client";

import {
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "../../lib/api/orders";

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

type StatusOption = {
  value: string;
  label: string;
  className: string;
};

const ORDER_STATUSES: StatusOption[] = [
  {
    value: "pending",
    label: "En attente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    value: "confirmed",
    label: "Confirmée",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "processing",
    label: "En préparation",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    value: "shipped",
    label: "Expédiée",
    className: "bg-violet-100 text-violet-800 border-violet-200",
  },
  {
    value: "delivered",
    label: "Livrée",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    value: "cancelled",
    label: "Annulée",
    className: "bg-red-100 text-red-800 border-red-200",
  },
];

const PAYMENT_STATUSES: StatusOption[] = [
  {
    value: "pending",
    label: "En attente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    value: "paid",
    label: "Payé",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    value: "failed",
    label: "Échec",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  {
    value: "refunded",
    label: "Remboursé",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
];

function getStatusOption(
  options: StatusOption[],
  value: string,
): StatusOption {
  return (
    options.find((option) => option.value === value) ?? {
      value,
      label: value,
      className:
        "bg-neutral-100 text-neutral-700 border-neutral-200",
    }
  );
}

interface StatusSelectProps {
  value: string;
  options: StatusOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

function StatusSelect({
  value,
  options,
  disabled,
  onChange,
}: StatusSelectProps) {
  const selected = getStatusOption(options, value);

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={`
        min-w-[145px]
        cursor-pointer
        appearance-none
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-semibold
        outline-none
        transition
        focus:ring-2
        focus:ring-neutral-300
        disabled:cursor-wait
        disabled:opacity-60
        ${selected.className}
      `}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-white text-neutral-900"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState<
    Record<string, boolean>
  >({});

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient<Order[]>("/orders");

      setOrders(data);
    } catch (err) {
      console.error("Erreur chargement commandes:", err);

      setError(
        "Impossible de charger les commandes.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateOrder(
    orderId: number,
    field: "status" | "payment_status",
    value: string,
  ) {
    const key = `${orderId}-${field}`;

    const previousOrder = orders.find(
      (order) => order.id === orderId,
    );

    if (!previousOrder) return;

    const previousValue = previousOrder[field];

    // Optimistic UI update
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              [field]: value,
            }
          : order,
      ),
    );

    setUpdating((current) => ({
      ...current,
      [key]: true,
    }));

    try {
      setError(null);

      if (field === "status") {
        await updateOrderStatus(orderId, value);
      } else {
        await updatePaymentStatus(orderId, value);
      }
    } catch (err) {
      console.error(
        "Erreur mise à jour commande:",
        err,
      );

      // Rollback
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                [field]: previousValue,
              }
            : order,
        ),
      );

      setError(
        `Impossible de modifier la commande #${orderId}.`,
      );
    } finally {
      setUpdating((current) => ({
        ...current,
        [key]: false,
      }));
    }
  }

  async function handleDeleteOrder(orderId: number) {
    const order = orders.find(
      (item) => item.id === orderId,
    );

    if (!order) return;

    const confirmed = window.confirm(
      `Êtes-vous sûre de vouloir supprimer la commande #${orderId} ?\n\n` +
        `Client : ${order.first_name} ${order.last_name}\n` +
        `Total : ${Number(order.total).toLocaleString(
          "fr-FR",
        )} DA\n\n` +
        `Cette action est irréversible.`,
    );

    if (!confirmed) return;

    const key = `${orderId}-delete`;

    setUpdating((current) => ({
      ...current,
      [key]: true,
    }));

    try {
      setError(null);

      await deleteOrder(orderId);

      // Supprimer immédiatement de l'interface
      setOrders((currentOrders) =>
        currentOrders.filter(
          (item) => item.id !== orderId,
        ),
      );
    } catch (err) {
      console.error(
        "Erreur suppression commande:",
        err,
      );

      setError(
        `Impossible de supprimer la commande #${orderId}.`,
      );
    } finally {
      setUpdating((current) => ({
        ...current,
        [key]: false,
      }));
    }
  }

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Gestion
          </p>

          <h1 className="font-serif text-4xl text-neutral-900">
            Commandes
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Gérez les commandes, leurs statuts et leurs paiements.
          </p>
        </div>

        <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm">
          <span className="font-semibold text-neutral-900">
            {orders.length}
          </span>{" "}
          commande{orders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError(null)}
            className="font-medium text-red-800 hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />

          <p className="text-sm text-neutral-500">
            Chargement des commandes...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-16 text-center shadow-sm">
          <p className="font-serif text-2xl text-neutral-900">
            Aucune commande
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            Les nouvelles commandes apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    #
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Client
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Statut
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Paiement
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const updatingStatus =
                    updating[
                      `${order.id}-status`
                    ] ?? false;

                  const updatingPayment =
                    updating[
                      `${order.id}-payment_status`
                    ] ?? false;

                  const deleting =
                    updating[
                      `${order.id}-delete`
                    ] ?? false;

                  return (
                    <tr
                      key={order.id}
                      className="group border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-50/70"
                    >
                      {/* ID */}
                      <td className="px-5 py-5">
                        <Link
                          href={`/orders/${order.id}`}
                          className="font-semibold text-neutral-900 underline-offset-4 transition hover:underline"
                        >
                          #{order.id}
                        </Link>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-5">
                        <div>
                          <p className="font-medium text-neutral-900">
                            {order.first_name}{" "}
                            {order.last_name}
                          </p>

                          <Link
                            href={`/orders/${order.id}`}
                            className="mt-1 inline-block text-xs text-neutral-400 hover:text-neutral-700 hover:underline"
                          >
                            Voir la commande
                          </Link>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-5">
                        <span className="font-medium text-neutral-900">
                          {Number(
                            order.total,
                          ).toLocaleString(
                            "fr-FR",
                          )}{" "}
                          DA
                        </span>
                      </td>

                      {/* Order status */}
                      <td className="px-5 py-5">
                        <StatusSelect
                          value={order.status}
                          options={ORDER_STATUSES}
                          disabled={updatingStatus}
                          onChange={(value) =>
                            updateOrder(
                              order.id,
                              "status",
                              value,
                            )
                          }
                        />
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-5">
                        <StatusSelect
                          value={
                            order.payment_status
                          }
                          options={
                            PAYMENT_STATUSES
                          }
                          disabled={
                            updatingPayment
                          }
                          onChange={(value) =>
                            updateOrder(
                              order.id,
                              "payment_status",
                              value,
                            )
                          }
                        />
                      </td>

                      {/* Date */}
                      <td className="px-5 py-5 text-neutral-500">
                        {new Date(
                          order.created_at,
                        ).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-900 hover:text-white"
                          >
                            Détails
                          </Link>

                          <button
                            type="button"
                            disabled={deleting}
                            onClick={() =>
                              handleDeleteOrder(
                                order.id,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                            title={`Supprimer la commande #${order.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />

                            {deleting
                              ? "Suppression..."
                              : "Supprimer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}