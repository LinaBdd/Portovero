"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiClient } from "../../lib/api/client";


interface Order {
  id: number;
  first_name: string;
  last_name: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}


export default function OrdersPage() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    apiClient<Order[]>("/orders")
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);


  return (
    <div>

      <h1 className="mb-8 text-2xl font-semibold">
        Commandes
      </h1>


      {loading ? (
        <p>Chargement...</p>
      ) : (

        <table className="w-full overflow-hidden rounded-xl border bg-white text-sm">

          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Client</th>
              <th className="p-4">Total</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Paiement</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>


          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-neutral-50"
              >

                <td className="p-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-medium underline"
                  >
                    #{order.id}
                  </Link>
                </td>


                <td className="p-4">
                  {order.first_name} {order.last_name}
                </td>


                <td className="p-4">
                  {Number(order.total).toLocaleString("fr-FR")} DA
                </td>


                <td className="p-4">
                  {order.status}
                </td>


                <td className="p-4">
                  {order.payment_status}
                </td>


                <td className="p-4">
                  {new Date(order.created_at)
                    .toLocaleDateString("fr-FR")}
                </td>


              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}