"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, login, getMe } from "../../../lib/api/auth";
import { useAuth } from "../../../store/auth";
import { ApiError } from "../../../lib/api/client";

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
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
      await register({
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        email: form.email || null,
        password: form.password,
      });

      // Auto-login juste après l'inscription
      const { access_token } = await login({
        phone: form.phone,
        password: form.password,
      });
      const user = await getMe(access_token);

      setSession(access_token, user);

      router.push("/account");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("Ce téléphone ou cet email est déjà utilisé.");
      } else {
        setError("Une erreur est survenue. Réessaie.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="mb-8 text-4xl font-serif">Créer un compte</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <input required name="firstName" placeholder="Prénom"
            value={form.firstName} onChange={handleChange}
            className="rounded-xl border p-4" />
          <input required name="lastName" placeholder="Nom"
            value={form.lastName} onChange={handleChange}
            className="rounded-xl border p-4" />
        </div>

        <input required name="phone" placeholder="Téléphone"
          value={form.phone} onChange={handleChange}
          className="w-full rounded-xl border p-4" />

        <input name="email" type="email" placeholder="Email (optionnel)"
          value={form.email} onChange={handleChange}
          className="w-full rounded-xl border p-4" />

        <input required name="password" type="password" placeholder="Mot de passe (8 caractères min.)"
          value={form.password} onChange={handleChange}
          minLength={8}
          className="w-full rounded-xl border p-4" />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0F2D52] py-4 text-lg font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Déjà un compte ?{" "}
        <Link href="/account/login" className="text-[#0F2D52] underline">
          Se connecter
        </Link>
      </p>
    </main>
  );
}