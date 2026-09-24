"use client";

import { useCart } from "../../store/cart";
import { useAuth } from "../../store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createAddress } from "../../lib/api/address";
import { createCheckout } from "../../lib/api/checkout";
import { createGuestOrder } from "../../lib/api/orders";

import {
  fetchWilayas,
  fetchCommunesByWilaya,
  ApiWilaya,
  ApiCommune,
} from "../../lib/api/locations";

import {
  fetchShippingMethods,
  fetchShippingRates,
  ApiShippingMethod,
  ApiShippingRate,
} from "../../lib/api/shpping";

// Mots-clés utilisés pour deviner si une méthode est un retrait en point
// relais / stopdesk plutôt qu'une livraison à domicile — même logique
// que _is_stopdesk() côté backend (app/services/shipping_price.py).
const STOPDESK_KEYWORDS = ["stopdesk", "stop desk", "point relais", "desk"];

function isStopdesk(methodName: string) {
  const name = methodName.toLowerCase();
  return STOPDESK_KEYWORDS.some((kw) => name.includes(kw));
}

export default function CheckoutPage() {
  const router = useRouter();

  const { items, clear } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [wilayas, setWilayas] = useState<ApiWilaya[]>([]);
  const [communes, setCommunes] = useState<ApiCommune[]>([]);

  const [shippingMethods, setShippingMethods] = useState<ApiShippingMethod[]>(
    []
  );
  const [loadingShippingMethods, setLoadingShippingMethods] = useState(true);

  const [shippingRates, setShippingRates] = useState<ApiShippingRate[]>([]);

  const [shippingMethodId, setShippingMethodId] = useState<number | null>(
    null
  );

  const [shippingRatesLoading, setShippingRatesLoading] = useState(false);

  const [initError, setInitError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    wilayaId: "",
    communeId: "",
    address: "",
  });

  // --------------------------------------------------
  // CHARGEMENT INITIAL
  // --------------------------------------------------

  function loadInitialData() {
    setInitError(null);

    fetchWilayas()
      .then(setWilayas)
      .catch((error) => {
        console.error("WILAYAS ERROR:", error);
        setInitError(
          "Impossible de charger les wilayas. Vérifie ta connexion et réessaie."
        );
      });

    setLoadingShippingMethods(true);

    fetchShippingMethods()
      .then((methods) => {
        setShippingMethods(methods);

        if (methods.length > 0) {
          setShippingMethodId(methods[0].id);
        }
      })
      .catch((error) => {
        console.error("SHIPPING METHODS ERROR:", error);
        setInitError(
          "Impossible de charger les méthodes de livraison. Vérifie ta connexion et réessaie."
        );
      })
      .finally(() => {
        setLoadingShippingMethods(false);
      });
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  // --------------------------------------------------
  // COMMUNES + TARIFS DE LIVRAISON
  // --------------------------------------------------

  useEffect(() => {
    if (!form.wilayaId) {
      setCommunes([]);
      setShippingRates([]);
      return;
    }

    const wilayaId = Number(form.wilayaId);

    // Charger les communes
    fetchCommunesByWilaya(wilayaId)
      .then(setCommunes)
      .catch((error) => {
        console.error("COMMUNES ERROR:", error);
        setCommunes([]);
      });

    // Charger les tarifs de livraison
    setShippingRatesLoading(true);

    fetchShippingRates(wilayaId)
      .then((rates) => {
        setShippingRates(rates);
      })
      .catch((error) => {
        console.error("SHIPPING RATES ERROR:", error);
        setShippingRates([]);
      })
      .finally(() => {
        setShippingRatesLoading(false);
      });
  }, [form.wilayaId]);

  // --------------------------------------------------
  // HANDLE FORM CHANGE
  // --------------------------------------------------

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "wilayaId"
        ? {
            communeId: "",
          }
        : {}),
    }));
  }

  // --------------------------------------------------
  // SOUS-TOTAL PRODUITS
  // --------------------------------------------------

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price =
        item.variant.price !== null &&
        item.variant.price !== undefined
          ? Number(item.variant.price)
          : Number(item.product.base_price);

      return total + price * item.quantity;
    }, 0);
  }, [items]);

  // --------------------------------------------------
  // WILAYA + MÉTHODE + TARIF DE LIVRAISON SÉLECTIONNÉS
  // --------------------------------------------------

  const selectedWilaya = useMemo(() => {
    if (!form.wilayaId) return null;

    return (
      wilayas.find((w) => String(w.id) === form.wilayaId) ?? null
    );
  }, [wilayas, form.wilayaId]);

  const selectedMethod = useMemo(() => {
    if (!shippingMethodId) return null;

    return (
      shippingMethods.find(
        (method: ApiShippingMethod) => method.id === shippingMethodId
      ) ?? null
    );
  }, [shippingMethods, shippingMethodId]);

  const selectedShippingRate = useMemo(() => {
    if (!shippingMethodId) {
      return null;
    }

    return (
      shippingRates.find(
        (rate) => rate.shipping_method_id === shippingMethodId
      ) ?? null
    );
  }, [shippingRates, shippingMethodId]);

  // --------------------------------------------------
  // PRIX LIVRAISON
  // Même ordre de priorité que get_shipping_price côté backend :
  // 1. Tarif précis (wilaya, méthode) dans shipping_rates.
  // 2. Tarif propre à la wilaya (home_shipping_price / stopdesk_shipping_price).
  // 3. Prix de base de la méthode, en dernier recours.
  // --------------------------------------------------

  const shippingPrice = useMemo(() => {
    if (selectedShippingRate) {
      return Number(selectedShippingRate.price);
    }

    if (selectedWilaya && selectedMethod) {
      const wilayaPrice = isStopdesk(selectedMethod.name)
        ? Number(selectedWilaya.stopdesk_shipping_price)
        : Number(selectedWilaya.home_shipping_price);

      if (wilayaPrice > 0) {
        return wilayaPrice;
      }
    }

    return selectedMethod ? Number(selectedMethod.base_price) : 0;
  }, [selectedShippingRate, selectedWilaya, selectedMethod]);

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  const total = subtotal + shippingPrice;

  // --------------------------------------------------
  // SUBMIT CHECKOUT
  // --------------------------------------------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

      // ----------------------------------------------
      // GUEST
      // ----------------------------------------------

      if (!user) {
        await createGuestOrder({
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          address: form.address,
          wilaya_id: Number(form.wilayaId),
          commune_id: Number(form.communeId),

          shipping_method_id: shippingMethodId,

          payment_method: "cash_on_delivery",

          items: items.map((item) => ({
            product_id: item.product.id,
            product_variant_id: item.variant?.id ?? null,
            quantity: item.quantity,
          })),

          coupon_code: null,
          notes: null,
        });
      }

      // ----------------------------------------------
      // USER CONNECTÉ
      // ----------------------------------------------

      else {
        const address = await createAddress(user.id, {
          label: "Adresse de livraison",
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          address: form.address,
          wilaya_id: Number(form.wilayaId),
          commune_id: Number(form.communeId),
          is_default: true,
        });

        await createCheckout({
          user_id: user.id,
          address_id: address.id,

          shipping_method_id: shippingMethodId,

          payment_method: "cash_on_delivery",

          coupon_code: null,
          notes: null,
        });
      }

      await clear();

      router.push("/checkout/success");
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Impossible de créer la commande. Vérifie les informations et réessaie."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-12 text-5xl font-serif">Checkout</h1>

      {initError && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {initError}{" "}
          <button
            type="button"
            onClick={loadInitialData}
            className="ml-2 underline"
          >
            Réessayer
          </button>
        </div>
      )}

      <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
        {/* =====================================================
            FORMULAIRE
        ====================================================== */}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* -------------------------------------------------
              INFORMATIONS PERSONNELLES
          -------------------------------------------------- */}

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
                type="tel"
                inputMode="numeric"
                pattern="(05|06|07)[0-9]{8}"
                maxLength={10}
                minLength={10}
                placeholder="Téléphone (ex: 0550123456)"
                value={form.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                  setForm((prev) => ({
                    ...prev,
                    phone: value,
                  }));
                }}
                className="rounded-xl border p-4"
              />
            </div>
          </section>

          {/* -------------------------------------------------
              ADRESSE
          -------------------------------------------------- */}

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Adresse</h2>

            <div className="space-y-6">
              {/* Wilaya */}

              <select
                required
                name="wilayaId"
                value={form.wilayaId}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              >
                <option value="">Sélectionner une wilaya</option>

                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.id}>
                    {wilaya.code} - {wilaya.name}
                  </option>
                ))}
              </select>

              {/* Commune */}

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

                {communes.map((commune) => (
                  <option key={commune.id} value={commune.id}>
                    {commune.name}
                  </option>
                ))}
              </select>

              {/* Adresse */}

              <input
                required
                name="address"
                placeholder="Adresse complète"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              />
            </div>
          </section>

          {/* -------------------------------------------------
              LIVRAISON
          -------------------------------------------------- */}

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Livraison</h2>

            {loadingShippingMethods ? (
              <p className="text-neutral-500">
                Chargement des méthodes de livraison...
              </p>
            ) : shippingMethods.length === 0 ? (
              <p className="text-neutral-500">
                Aucune méthode de livraison disponible pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {shippingMethods.map((method: ApiShippingMethod) => {
                  const rate = shippingRates.find(
                    (shippingRate) =>
                      shippingRate.shipping_method_id === method.id
                  );

                  // Même priorité que côté backend : tarif précis >
                  // tarif de la wilaya (domicile/stopdesk) > prix de
                  // base de la méthode.
                  const wilayaPrice = selectedWilaya
                    ? isStopdesk(method.name)
                      ? Number(selectedWilaya.stopdesk_shipping_price)
                      : Number(selectedWilaya.home_shipping_price)
                    : 0;

                  const effectivePrice = rate
                    ? Number(rate.price)
                    : wilayaPrice > 0
                    ? wilayaPrice
                    : Number(method.base_price);

                  const isSelected = shippingMethodId === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                        isSelected
                          ? "border-[#0F2D52] bg-[#0F2D52]/5"
                          : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={isSelected}
                          onChange={() => setShippingMethodId(method.id)}
                          disabled={!form.wilayaId || shippingRatesLoading}
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

                      {/* Prix */}

                      <span className="font-semibold">
                        {!form.wilayaId
                          ? "Sélectionnez une wilaya"
                          : shippingRatesLoading
                          ? "Chargement..."
                          : `${effectivePrice.toLocaleString("fr-FR")} DA`}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </section>

          {/* -------------------------------------------------
              BOUTON
          -------------------------------------------------- */}

          <button
            type="submit"
            disabled={loading || items.length === 0 || !shippingMethodId}
            className="w-full rounded-full bg-[#0F2D52] py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Création de la commande..." : "Confirmer la commande"}
          </button>
        </form>

        {/* =====================================================
            RÉSUMÉ
        ====================================================== */}

        <aside className="h-fit rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Résumé</h2>

          {/* PRODUITS */}

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
                    {(price * item.quantity).toLocaleString("fr-FR")} DA
                  </span>
                </div>
              );
            })}
          </div>

          <div className="my-6 border-t" />

          {/* SOUS-TOTAL */}

          <div className="flex justify-between">
            <span className="text-neutral-600">Sous-total</span>

            <span className="font-medium">
              {subtotal.toLocaleString("fr-FR")} DA
            </span>
          </div>

          {/* LIVRAISON */}

          <div className="mt-3 flex justify-between">
            <span className="text-neutral-600">Livraison</span>

            <span className="font-medium">
              {!form.wilayaId
                ? "—"
                : shippingRatesLoading
                ? "Chargement..."
                : shippingMethodId
                ? `${shippingPrice.toLocaleString("fr-FR")} DA`
                : "—"}
            </span>
          </div>

          <div className="my-6 border-t" />

          {/* TOTAL */}

          <div className="flex justify-between text-xl font-semibold">
            <span>Total</span>

            <span>{total.toLocaleString("fr-FR")} DA</span>
          </div>
        </aside>
      </div>
    </main>
  );
}