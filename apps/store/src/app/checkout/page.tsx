"use client";

import { useCart } from "../../store/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAddress } from "../../lib/api/address";
import { createCheckout } from "../../lib/api/checkout";

export default function CheckoutPage() {
  const router = useRouter();

  const { items, clear } = useCart();

  // TEMPORAIRE :
  // Mets ici l'id d'un utilisateur existant dans ton backend.
  const USER_ID = 1;

  const [loading, setLoading] = useState(false);

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

  const subtotal = items.reduce((sum, item) => {
    const price =
      item.variant.price !== null &&
      item.variant.price !== undefined
        ? Number(item.variant.price)
        : Number(item.product.base_price);

    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 30000 ? 0 : 600;
  const total = subtotal + shipping;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    try {
      setLoading(true);

      /*
       * =====================================
       * 1. CREER L'ADRESSE
       * =====================================
       *
       * Pour l'instant on utilise :
       * - wilaya_id = 21 (Skikda)
       *
       * IMPORTANT :
       * commune_id doit correspondre à une commune
       * existante dans ta DB.
       *
       * Change cette valeur avec un vrai commune_id.
       */

      const address = await createAddress(USER_ID, {
        label: "Adresse de livraison",

        first_name: form.firstName,

        last_name: form.lastName,

        phone: form.phone,

        address: form.address,

        wilaya_id: 21,

        commune_id: 1,

        postal_code: form.postalCode || null,

        is_default: true,
      });

      /*
       * =====================================
       * 2. CREER LA COMMANDE
       * =====================================
       */

      const order = await createCheckout({
        user_id: USER_ID,

        address_id: address.id,

        /*
         * TEMPORAIRE :
         * on utilise le shipping method 1.
         */
        shipping_method_id: 1,

        payment_method: "cash_on_delivery",

        coupon_code: null,

        notes: null,
      });

      console.log("COMMANDE CRÉÉE :", order);

      /*
       * =====================================
       * 3. VIDER LE PANIER
       * =====================================
       */

      clear();

      /*
       * =====================================
       * 4. PAGE SUCCESS
       * =====================================
       */

      router.push("/checkout/success");
    } catch (error) {
      console.error("CHECKOUT ERROR :", error);

      alert(
        "Impossible de créer la commande. Vérifie les informations et réessaie."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="mb-12 text-5xl font-serif">
        Checkout
      </h1>

      <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">

        {/* ================================
            FORMULAIRE
        ================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >

          {/* ================================
              INFORMATIONS PERSONNELLES
          ================================= */}

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
                type="email"
                placeholder="Email (optionnel)"
                value={form.email}
                onChange={handleChange}
                className="rounded-xl border p-4"
              />

            </div>

          </section>

          {/* ================================
              ADRESSE
          ================================= */}

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

          {/* ================================
              LIVRAISON
          ================================= */}

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

          {/* ================================
              BOUTON
          ================================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0F2D52] py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading
              ? "Création de la commande..."
              : "Confirmer la commande"}

          </button>

        </form>

        {/* ================================
            RESUME
        ================================= */}

        <aside className="h-fit rounded-3xl border bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-2xl font-semibold">
            Résumé
          </h2>

          <div className="space-y-4">

            {items.map((item) => {

              const price =
                item.variant.price !== null &&
                item.variant.price !== undefined
                  ? Number(item.variant.price)
                  : Number(item.product.base_price);

              return (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="flex justify-between gap-4"
                >

                  <span>
                    {item.product.name} × {item.quantity}
                  </span>

                  <span className="whitespace-nowrap">
                    {(price * item.quantity).toLocaleString(
                      "fr-FR"
                    )}{" "}
                    DA
                  </span>

                </div>
              );

            })}

          </div>

          <hr className="my-6" />

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Sous-total</span>

              <span>
                {subtotal.toLocaleString("fr-FR")} DA
              </span>
            </div>

            <div className="flex justify-between">

              <span>
                Livraison
              </span>

              <span>
                {shipping === 0
                  ? "Gratuite"
                  : `${shipping} DA`}
              </span>

            </div>

            <div className="flex justify-between text-xl font-bold">

              <span>
                Total
              </span>

              <span>
                {total.toLocaleString("fr-FR")} DA
              </span>

            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}