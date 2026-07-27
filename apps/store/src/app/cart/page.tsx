"use client";

import Image from "next/image";
import Link from "next/link";

import { Trash2, Minus, Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import { useCart } from "../../store/cart";

export default function CartPage() {
  const {
    items,
    remove,
    increase,
    decrease,
  } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;

  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6">

        <h1 className="mb-4 text-5xl font-serif">
          Your Cart
        </h1>

        <p className="mb-8 text-neutral-500">
          Your shopping cart is empty.
        </p>

        <Link href="/shop">

          <Button variant="primary">
            Continue Shopping
          </Button>

        </Link>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="mb-12 text-5xl font-serif">
        Shopping Cart
      </h1>

      <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">

        {/* Products */}

        <div className="space-y-8">

          {items.map((item) => (

            <div
              key={item.product.id}
              className="flex gap-6 rounded-3xl bg-white p-6 shadow-sm"
            >

              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                width={140}
                height={180}
                className="rounded-2xl object-cover"
              />

              <div className="flex flex-1 flex-col justify-between">

                <div>

                  <p className="text-sm uppercase tracking-widest text-[#C8A96A]">
                    {item.product.category}
                  </p>

                  <h2 className="mt-2 text-2xl font-serif">
                    {item.product.name}
                  </h2>

                  <p className="mt-4 font-semibold">
                    {item.product.price.toLocaleString("fr-FR")} DA
                  </p>

                </div>

                <div className="mt-6 flex items-center justify-between">

                  <div className="flex items-center rounded-full border">

                    <button
                      onClick={() => decrease(item.product.id)}
                      className="p-3"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="px-5 font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increase(item.product.id)}
                      className="p-3"
                    >
                      <Plus size={18} />
                    </button>

                  </div>

                  <button
                    onClick={() => remove(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Summary */}

        <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="mb-8 text-3xl font-serif">
            Order Summary
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span>Subtotal</span>

              <span>
                {subtotal.toLocaleString("fr-FR")} DA
              </span>

            </div>

            <div className="flex justify-between">

              <span>Delivery</span>

              <span className="text-green-600">
                Free
              </span>

            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">

              <span>Total</span>

              <span>
                {total.toLocaleString("fr-FR")} DA
              </span>

            </div>

            <Link
  href="/checkout"
  className="flex h-14 items-center justify-center rounded-full bg-[#0F2D52] text-white transition hover:bg-[#173F73]"
>
  Proceed to Checkout
</Link>

            <Link
              href="/shop"
              className="block text-center text-sm text-neutral-500 hover:text-black"
            >
              Continue Shopping
            </Link>

          </div>

        </aside>

      </div>

    </main>
  );
}