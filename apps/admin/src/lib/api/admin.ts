import { apiClient } from "./client";

export interface MonthlyStats {
  month: string;
  revenue: number;
  orders: number;
}

export interface StatusStats {
  status: string;
  count: number;
}

export interface PaymentStats {
  status: string;
  count: number;
}

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_payments: number;
  pending_orders: number;
  revenue: number;

  monthly_stats: MonthlyStats[];
  order_statuses: StatusStats[];
  payment_statuses: PaymentStats[];
}

export function fetchDashboard() {
  return apiClient<DashboardStats>("/admin/dashboard");
}