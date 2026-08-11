"use client";

import { useCart } from "../../store/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createAddress } from "../../lib/api/address";
import { createCheckout } from "../../lib/api/checkout";
import {
  fetchWilayas,
  fetchCommunesByWilaya,
  ApiWilaya,
  ApiCommune,
} from "../../lib/api/locations";
import {
  fetchShippingMethods,
  ApiShippingMethod,
} from "../../lib/api/shipping";

import { useAuth } from "../../store/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [wilayas, setWilayas] = useState<ApiWilaya[]>([]);
  const [communes, setCommunes] = useState<ApiCommune[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ApiShippingMethod[]>([]);
  const [shippingMethodId, setShippingMethodId] = useState<number | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    wilayaId: "",
    communeId: "",
    address: "",
    postalCode: "",
  });

  // Charger la liste des wilayas au montage
  useEffect(() => {
    fetchWilayas().then(setWilayas).catch(console.error);
  }, []);

  // Charger les méthodes de livraison au montage
  useEffect(() => {
    fetchShippingMethods()
      .then((methods: ApiShippingMethod[]) => {
        setShippingMethods(methods);
        if (methods.length > 0) {
          setShippingMethodId(methods[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Recharger les communes quand la wilaya change
  useEffect(() => {
    if (!form.wilayaId) {
      setCommunes([]);
      return;
    }
    fetchCommunesByWilaya(Number(form.wilayaId))
      .then(setCommunes)
      .catch(console.error);
  }, [form.wilayaId]);

  const subtotal = items.reduce((sum, item) => {
    const price =
      item.variant.price !== null && item.variant.price !== undefined
        ? Number(item.variant.price)
        : Number(item.product.base_price);
    return sum + price * item.quantity;
  }, 0);

  const selectedMethod = shippingMethods.find((m) => m.id === shippingMethodId);
  const shipping = selectedMethod ? Number(selectedMethod.base_price) : 0;
  const total = subtotal + shipping;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // reset commune si on change de wilaya
      ...(name === "wilayaId" ? { communeId: "" } : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      router.push("/account/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    if (!form.wilayaId || !form.communeId) {
      alert("Merci de sélectionner une wilaya et une commune.");
      return;
    }

    if (!shippingMethodId) {
      alert("Merci de sélectionner une méthode de livraison.");
      return;
    }

    try {
      setLoading(true);

      const address = await createAddress(user.id, {
        label: "Adresse de livraison",
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        address: form.address,
        wilaya_id: Number(form.wilayaId),
        commune_id: Number(form.communeId),
        postal_code: form.postalCode || null,
        is_default: true,
      });

      const order = await createCheckout({
        user_id: user.id,
        address_id: address.id,
        shipping_method_id: shippingMethodId,
        payment_method: "cash_on_delivery",
        coupon_code: null,
        notes: null,
      });

      console.log("COMMANDE CRÉÉE :", order);

      await clear();
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
      <h1 className="mb-12 text-5xl font-serif">Checkout</h1>

      <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-10">
          <section>
            <h2 className="mb-6 text-2xl font-semibold">
              Informations personnelles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <input required name="firstName" placeholder="Prénom"
                value={form.firstName} onChange={handleChange}
                className="rounded-xl border p-4" />
              <input required name="lastName" placeholder="Nom"
                value={form.lastName} onChange={handleChange}
                className="rounded-xl border p-4" />
              <input required name="phone" placeholder="Téléphone"
                value={form.phone} onChange={handleChange}
                className="rounded-xl border p-4" />
              <input name="email" type="email" placeholder="Email (optionnel)"
                value={form.email} onChange={handleChange}
                className="rounded-xl border p-4" />
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Adresse</h2>
            <div className="space-y-6">
              <select
                required
                name="wilayaId"
                value={form.wilayaId}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              >
                <option value="">Sélectionner une wilaya</option>
                {wilayas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.code} - {w.name}
                  </option>
                ))}
              </select>

              <select
                required
                name="communeId"
                value={form.communeId}
                onChange={handleChange}
                disabled={!form.wilayaId}
                className="w-full rounded-xl border p-4 disabled:opacity-50"
              >
                <option value="">
                  {form.wilayaId
                    ? "Sélectionner une commune"
                    : "Choisis d'abord une wilaya"}
                </option>
                {communes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input required name="address" placeholder="Adresse complète"
                value={form.address} onChange={handleChange}
                className="w-full rounded-xl border p-4" />

              <input name="postalCode" placeholder="Code postal"
                value={form.postalCode} onChange={handleChange}
                className="w-full rounded-xl border p-4" />
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Livraison</h2>

            {shippingMethods.length === 0 ? (
              <p className="text-neutral-500">
                Chargement des méthodes de livraison...
              </p>
            ) : (
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      shippingMethodId === method.id
                        ? "border-[#0F2D52] bg-[#0F2D52]/5"
                        : "border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethodId === method.id}
                        onChange={() => setShippingMethodId(method.id)}
                        className="h-4 w-4 accent-[#0F2D52]"
                      />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        {method.description && (
                          <p className="text-sm text-neutral-500">
                            {method.description}
                          </p>
                        )}
                        <p className="text-sm text-neutral-400">
                          Livraison estimée : {method.estimated_days} jour
                          {method.estimated_days > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <span className="font-semibold">
                      {Number(method.base_price) === 0
                        ? "Gratuite"
                        : `${Number(method.base_price).toLocaleString("fr-FR")} DA`}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0F2D52] py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Création de la commande..." : "Confirmer la commande"}
          </button>
        </form>

        <aside className="h-fit rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Résumé</h2>
          <div className="space-y-4">
            {items.map((item) => {
              const price =
                item.variant.price !== null && item.variant.price !== undefined
                  ? Number(item.variant.price)
                  : Number(item.product.base_price);
              return (
                <div key={`${item.product.id}-${item.variant.id}`} className="flex justify-between gap-4">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="whitespace-nowrap">
                    {(price * item.quantity).toLocaleString("fr-FR")} DA
                  </span>
                </div>
              );
            })}
          </div>
          <hr className="my-6" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString("fr-FR")} DA</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>{shipping === 0 ? "Gratuite" : `${shipping.toLocaleString("fr-FR")} DA`}</span>
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