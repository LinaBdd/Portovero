"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  fetchDashboard,
  DashboardStats,
} from "../lib/api/admin";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmées",
  processing: "En préparation",
  shipped: "Expédiées",
  delivered: "Livrées",
  cancelled: "Annulées",
};

const PAYMENT_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payé",
  failed: "Échec",
  refunded: "Remboursé",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les statistiques.");
      });
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <p>Chargement...</p>;
  }

  const cards = [
    {
      label: "Utilisateurs",
      value: stats.total_users,
    },
    {
      label: "Produits",
      value: stats.total_products,
    },
    {
      label: "Commandes",
      value: stats.total_orders,
    },
    {
      label: "Commandes en attente",
      value: stats.pending_orders,
    },
    {
      label: "Paiements",
      value: stats.total_payments,
    },
    {
      label: "Chiffre d'affaires",
      value: `${Number(stats.revenue).toLocaleString("fr-FR")} DA`,
    },
  ];

  const orderStatusData = stats.order_statuses.map((item) => ({
    name: STATUS_LABELS[item.status] ?? item.status,
    value: item.count,
  }));

  const paymentStatusData = stats.payment_statuses.map((item) => ({
    name: PAYMENT_LABELS[item.status] ?? item.status,
    value: item.count,
  }));

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Vue d'ensemble de votre boutique.
        </p>
      </div>


      {/* KPI */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-white p-6"
          >
            <p className="text-sm text-neutral-500">
              {card.label}
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {typeof card.value === "number"
                ? card.value.toLocaleString("fr-FR")
                : card.value}
            </p>
          </div>
        ))}

      </div>


      {/* CA */}

      <div className="rounded-xl border bg-white p-6">

        <div className="mb-6">
          <h2 className="font-medium">
            Chiffre d'affaires
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Évolution du chiffre d'affaires sur les 6 derniers mois.
          </p>
        </div>

        <div className="h-[320px]">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthly_stats}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis
                tickFormatter={(value: number) =>
                  `${Number(value).toLocaleString("fr-FR")}`
                }
              />

              <Tooltip
                formatter={(value) =>
                  `${Number(value).toLocaleString("fr-FR")} DA`
                }
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#111827"
                strokeWidth={3}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>


      {/* COMMANDES */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl border bg-white p-6">

          <div className="mb-6">
            <h2 className="font-medium">
              Commandes
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Évolution des commandes.
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly_stats}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  fill="#111827"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>


        {/* STATUTS */}

        <div className="rounded-xl border bg-white p-6">

          <div className="mb-6">
            <h2 className="font-medium">
              Statut des commandes
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Répartition actuelle des commandes.
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* PAIEMENTS */}

      <div className="rounded-xl border bg-white p-6">

        <div className="mb-6">
          <h2 className="font-medium">
            Paiements
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Répartition des paiements par statut.
          </p>
        </div>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={paymentStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {paymentStatusData.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}