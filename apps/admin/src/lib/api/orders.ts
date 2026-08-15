import { apiClient } from "./client";

export interface OrderItem {
  id: number;
  product_name: string;
  color: string | null;
  size: string | null;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface ApiOrderDetail {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  address: string;
  wilaya: string;
  commune: string;
  shipping_method: string;
  subtotal: string;
  shipping_cost: string;
  total: string;
  status: string;
  payment_method: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
}

export function fetchOrderDetail(id: number) {
  return apiClient<ApiOrderDetail>(`/orders/${id}`);
}

export function updateOrderStatus(id: number, status: string) {
  return apiClient(`/orders/${id}`, {
    method: "PUT",
    body: { status },
  });
}

export function updatePaymentStatus(
  id: number,
  status: string
) {
  return apiClient(
    `/admin/orders/${id}/payment-status`,
    {
      method: "PATCH",
      body: {
        payment_status: status,
      },
    }
  );
}