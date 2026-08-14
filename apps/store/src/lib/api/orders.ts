import { apiClient } from "./client";

export interface ApiOrder {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;

  address: string;
  wilaya: string;
  commune: string;

  shipping_method: string;
  subtotal: string | number;
  shipping_cost: string | number;
  discount: string | number;
  total: string | number;

  status: string;
  payment_method: string;
  payment_status: string;

  coupon_code: string | null;
  notes: string | null;

  created_at: string;
  updated_at?: string;
}

export function fetchMyOrders() {
  return apiClient<ApiOrder[]>("/orders/my-orders");
}

export function fetchOrder(orderId: number) {
  return apiClient<ApiOrder>(`/orders/${orderId}`);
}

export async function createGuestOrder(data:any){

  const res = await fetch(
    "http://localhost:8000/orders/guest",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(data),
    }
  );


  if(!res.ok){
    throw new Error(
      "Guest order failed"
    );
  }


  return res.json();
}