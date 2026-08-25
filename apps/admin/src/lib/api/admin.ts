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

export interface StockAlertProduct {
  id: number;
  name: string;
  sku: string;
  stock: number;
}

export interface DashboardStats {
  total_users: number;

  total_products: number;
  active_products: number;
  inactive_products: number;

  total_orders: number;
  confirmed_orders: number;
  pending_orders: number;

  paid_orders: number;

  total_payments: number;
  paid_payments: number;

  revenue: number;

  total_stock: number;

  total_stock_value_cost: number;
  total_stock_value_sale: number;
  total_potential_profit: number;

  out_of_stock_count: number;
  low_stock_count: number;
  low_stock_threshold: number;

  monthly_stats: MonthlyStats[];

  order_statuses: StatusStats[];

  payment_statuses: PaymentStats[];

  out_of_stock_products: StockAlertProduct[];

  low_stock_products: StockAlertProduct[];
}

export function fetchDashboard() {
  return apiClient<DashboardStats>("/admin/dashboard");
}