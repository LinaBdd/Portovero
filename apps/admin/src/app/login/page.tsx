"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getMe } from "../../lib/api/auth";
import { useAdminAuth } from "../../store/auth";
import { ApiError } from "../../lib/api/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAdminAuth((s) => s.setSession);

  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { access_token } = await login(form);
      const user = await getMe(access_token);

      if (!user.is_admin) {
        setError("Accès réservé aux administrateurs.");
        return;
      }

      setSession(access_token, user);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Identifiants incorrects.");
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Portovero Admin</h1>

        <input
          required
          placeholder="Téléphone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border p-3"
        />

        <input
          required
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border p-3"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-neutral-900 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}