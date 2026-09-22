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

import { ApiError } from "../lib/api/client";

/* ============================================================
   LABELS
============================================================ */

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
  completed: "Payé",
  paid: "Payé",
  failed: "Échec",
  refunded: "Remboursé",
};

/* ============================================================
   COULEURS
============================================================ */

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "#b8a98c",
  confirmed: "#0F2D52",
  processing: "#8f8064",
  shipped: "#52634f",
  delivered: "#52634f",
  cancelled: "#9b5c58",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "#b8a98c",
  completed: "#52634f",
  paid: "#52634f",
  failed: "#9b5c58",
  refunded: "#8f8064",
};

/* ============================================================
   DASHBOARD
============================================================ */

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ==========================================================
     FETCH DASHBOARD
  ========================================================== */

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch((err) => {
        console.error(err);

        if (err instanceof ApiError && err.status === 401) {
          setError("Session expirée. Reconnectez-vous.");
          return;
        }

        setError("Impossible de charger les statistiques.");
      });
  }, []);

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (!stats) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-[#0F2D52]" />
          Chargement du dashboard...
        </div>
      </div>
    );
  }

  /* ==========================================================
     KPI CARDS
  ========================================================== */

  const cards: Array<{
    label: string;
    value: number | string;
    color: string;
    bg: string;
  }> = [
    {
      label: "Utilisateurs",
      value: stats.total_users,
      color: "#0F2D52",
      bg: "bg-blue-50",
    },
    {
      label: "Produits",
      value: stats.total_products,
      color: "#8f8064",
      bg: "bg-violet-50",
    },
    {
      label: "Commandes",
      value: stats.total_orders,
      color: "#0F2D52",
      bg: "bg-blue-50",
    },
    {
      label: "Commandes confirmées",
      value: stats.confirmed_orders,
      color: "#52634f",
      bg: "bg-emerald-50",
    },
    {
      label: "Commandes en attente",
      value: stats.pending_orders,
      color: "#b8a98c",
      bg: "bg-amber-50",
    },
    {
      label: "Commandes payées",
      value: stats.paid_payments,
      color: "#52634f",
      bg: "bg-emerald-50",
    },
    {
      label: "Chiffre d'affaires",
      value: `${Number(stats.revenue).toLocaleString("fr-FR")} DA`,
      color: "#0F2D52",
      bg: "bg-blue-50",
    },
    {
      label: "Stock total",
      value: stats.total_stock,
      color: "#52634f",
      bg: "bg-cyan-50",
    },
    {
      label: "Produits en rupture",
      value: stats.out_of_stock_count,
      color: "#9b5c58",
      bg: "bg-red-50",
    },
    {
      label: "Stock faible",
      value: stats.low_stock_count,
      color: "#b8a98c",
      bg: "bg-amber-50",
    },
  ];

  /* ==========================================================
     ORDER STATUS DATA
  ========================================================== */

  const orderStatusData = stats.order_statuses.map((item) => ({
    name: STATUS_LABELS[item.status] ?? item.status,
    value: item.count,
    color: ORDER_STATUS_COLORS[item.status] ?? "#94A3B8",
  }));

  /* ==========================================================
     PAYMENT STATUS DATA
  ========================================================== */

  const paymentStatusData = stats.payment_statuses.map((item) => ({
    name: PAYMENT_LABELS[item.status] ?? item.status,
    value: item.count,
    color: PAYMENT_STATUS_COLORS[item.status] ?? "#94A3B8",
  }));

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <div className="space-y-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Vue d&apos;ensemble de votre boutique.
        </p>
      </div>

      {/* ======================================================
          KPI
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {cards.map((card) => (
          <div
            key={card.label}
            className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">
                <p className="text-sm text-neutral-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-neutral-900">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString("fr-FR")
                    : card.value}
                </p>
              </div>

              <div
                className={`h-3 w-3 shrink-0 rounded-full ${card.bg}`}
                style={{
                  backgroundColor: card.color,
                  boxShadow: `0 0 0 5px ${card.color}15`,
                }}
              />
            </div>

            <div
              className="mt-4 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-20"
              style={{
                backgroundColor: card.color,
              }}
            />
          </div>
        ))}

      </div>

      {/* ======================================================
          CHIFFRE D'AFFAIRES
      ====================================================== */}

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="font-medium text-neutral-900">
            Chiffre d&apos;affaires
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Évolution du chiffre d&apos;affaires sur les 6 derniers mois.
          </p>
        </div>

        <div className="h-[320px]">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.monthly_stats}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#737373",
                  fontSize: 12,
                }}
                axisLine={{
                  stroke: "#E5E7EB",
                }}
              />

              <YAxis
                tick={{
                  fill: "#737373",
                  fontSize: 12,
                }}
                tickFormatter={(value: number) =>
                  Number(value).toLocaleString("fr-FR")
                }
                axisLine={{
                  stroke: "#E5E7EB",
                }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value) =>
                  `${Number(value).toLocaleString("fr-FR")} DA`
                }
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0F2D52"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#0F2D52",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#0F2D52",
                }}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ======================================================
          COMMANDES + STATUTS
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ====================================================
            COMMANDES
        ==================================================== */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="font-medium text-neutral-900">
              Commandes
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Évolution des commandes.
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.monthly_stats}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "#737373",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#E5E7EB",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#737373",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#E5E7EB",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />

                <Bar
                  dataKey="orders"
                  fill="#0F2D52"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* ====================================================
            STATUTS COMMANDES
        ==================================================== */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="font-medium text-neutral-900">
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
                  innerRadius={55}
                  paddingAngle={2}
                  label
                >

                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`order-cell-${index}`}
                      fill={entry.color}
                    />
                  ))}

                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ======================================================
          PAIEMENTS
      ====================================================== */}

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="font-medium text-neutral-900">
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
                innerRadius={55}
                paddingAngle={2}
                label
              >

                {paymentStatusData.map((entry, index) => (
                  <Cell
                    key={`payment-cell-${index}`}
                    fill={entry.color}
                  />
                ))}

              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}