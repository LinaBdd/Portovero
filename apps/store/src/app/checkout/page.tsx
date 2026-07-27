"use client";

import { useCart } from "../../store/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();

  const { items, clear } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 30000 ? 0 : 600;

  const total = subtotal + shipping;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    wilaya: "",
    commune: "",
    address: "",
    postalCode: "",
    delivery: "home",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);
    console.log(items);

    clear();

    router.push("/checkout/success");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="mb-12 text-5xl font-serif">
        Checkout
      </h1>

      <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >

          <section>

            <h2 className="mb-6 text-2xl font-semibold">
              Informations personnelles
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <input
                required
                name="firstName"
                placeholder="Prénom"
                value={form.firstName}
                onChange={handleChange}
                className="rounded-xl border p-4"
              />

              <input
                required
                name="lastName"
                placeholder="Nom"
                value={form.lastName}
                onChange={handleChange}
                className="rounded-xl border p-4"
              />

              <input
                required
                name="phone"
                placeholder="Téléphone"
                value={form.phone}
                onChange={handleChange}
                className="rounded-xl border p-4"
              />

              <input
                name="email"
                placeholder="Email (optionnel)"
                value={form.email}
                onChange={handleChange}
                className="rounded-xl border p-4"
              />

            </div>

          </section>

          <section>

            <h2 className="mb-6 text-2xl font-semibold">
              Adresse
            </h2>

            <div className="space-y-6">

              <input
                required
                name="wilaya"
                placeholder="Wilaya"
                value={form.wilaya}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              />

              <input
                required
                name="commune"
                placeholder="Commune"
                value={form.commune}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              />

              <input
                required
                name="address"
                placeholder="Adresse complète"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              />

              <input
                name="postalCode"
                placeholder="Code postal"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              />

            </div>

          </section>

          <section>

            <h2 className="mb-6 text-2xl font-semibold">
              Livraison
            </h2>

            <select
              name="delivery"
              value={form.delivery}
              onChange={handleChange}
              className="w-full rounded-xl border p-4"
            >
              <option value="home">
                Livraison à domicile
              </option>

              <option value="relay">
                Point relais
              </option>

            </select>

          </section>

          <button
            className="w-full rounded-full bg-[#0F2D52] py-4 text-lg font-semibold text-white"
          >
            Confirmer la commande
          </button>

        </form>

        <aside className="rounded-3xl border bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-2xl font-semibold">
            Résumé
          </h2>

          <div className="space-y-4">

            {items.map((item) => (

              <div
                key={item.product.id}
                className="flex justify-between"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>

                <span>
                  {(item.product.price * item.quantity).toLocaleString("fr-FR")} DA
                </span>

              </div>

            ))}

          </div>

          <hr className="my-6" />

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString("fr-FR")} DA</span>
            </div>

            <div className="flex justify-between">
              <span>Livraison</span>
              <span>
                {shipping === 0
                  ? "Gratuite"
                  : `${shipping} DA`}
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{total.toLocaleString("fr-FR")} DA</span>
            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}