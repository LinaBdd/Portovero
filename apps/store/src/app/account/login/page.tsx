"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, getMe } from "../../../lib/api/auth";
import { useAuth } from "../../../store/auth";
import { ApiError } from "../../../lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);

  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { access_token } = await login(form);
      const user = await getMe(access_token);

      setSession(access_token, user);

      router.push("/account");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Téléphone ou mot de passe incorrect.");
      } else {
        setError("Une erreur est survenue. Réessaie.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="mb-8 text-4xl font-serif">Connexion</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          required
          name="phone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-xl border p-4"
        />

        <input
          required
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-xl border p-4"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0F2D52] py-4 text-lg font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Pas de compte ?{" "}
        <Link href="/account/register" className="text-[#0F2D52] underline">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}