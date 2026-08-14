"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../store/auth";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/account/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // évite le flash de contenu avant la redirection
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-serif">
        Bonjour, {user.first_name}
      </h1>

      <p className="mb-10 text-neutral-500">{user.phone}{user.email ? ` · ${user.email}` : ""}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="rounded-2xl border p-6 transition hover:bg-neutral-50"
        >
          <h2 className="text-lg font-semibold">Mes commandes</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Suivre mes commandes en cours
          </p>
        </Link>

        <Link
          href="/account/wishlist"
          className="rounded-2xl border p-6 transition hover:bg-neutral-50"
        >
          <h2 className="text-lg font-semibold">Ma liste de souhaits</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Voir mes produits favoris
          </p>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 rounded-full border border-red-200 px-6 py-3 text-red-600 transition hover:bg-red-50"
      >
        Se déconnecter
      </button>
    </main>
  );
}