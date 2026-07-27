"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  const orderNumber = `PV-${Date.now().toString().slice(-6)}`;

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-6 py-20">

      <div className="w-full rounded-3xl bg-white p-12 text-center shadow-lg">

        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              className="h-14 w-14 text-green-600"
              strokeWidth={2}
            />
          </div>
        </div>

        <p className="uppercase tracking-[0.35em] text-[#C8A96A]">
          Merci pour votre commande
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Commande confirmée
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-600">
          Votre commande a bien été enregistrée.
          Nous vous contacterons prochainement afin de confirmer
          la livraison.
        </p>

        <div className="mt-10 rounded-2xl border bg-[#FAF0E6] p-6">

          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Numéro de commande
          </p>

          <p className="mt-2 text-3xl font-bold text-[#0F2D52]">
            {orderNumber}
          </p>

        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">

          <Link
            href="/"
            className="flex h-14 items-center justify-center gap-2 rounded-full border transition hover:bg-neutral-100"
          >
            <ArrowLeft size={18} />
            Retour à l'accueil
          </Link>

          <Link
            href="/collections"
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#0F2D52] text-white transition hover:bg-[#173F73]"
          >
            <ShoppingBag size={18} />
            Continuer mes achats
          </Link>

        </div>

      </div>

    </main>
  );
}