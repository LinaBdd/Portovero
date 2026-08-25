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

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-xl items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full">

          {/* Intro */}
          <div className="mb-10 text-center">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B89B5E]">
              Portovero
            </p>

            <h1 className="font-heading text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
              Welcome back
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#81786D]">
              Connectez-vous pour retrouver vos commandes, votre wishlist
              et vos informations personnelles.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-xs font-medium text-[#172B3A]"
              >
                Téléphone
              </label>

              <input
                id="phone"
                required
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Votre numéro de téléphone"
                value={form.phone}
                onChange={handleChange}
                className="
                  h-14 w-full rounded-2xl
                  border border-transparent
                  bg-[#FFFCF7]
                  px-5
                  text-sm text-[#172B3A]
                  shadow-[0_2px_12px_rgba(23,43,58,0.04)]
                  outline-none
                  placeholder:text-[#A49B90]
                  transition-all duration-200
                  focus:border-[#B89B5E]/40
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#B89B5E]/10
                "
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#172B3A]"
                >
                  Mot de passe
                </label>

                <Link
                  href="/account/forgot-password"
                  className="
                    text-[11px]
                    text-[#81786D]
                    transition-colors
                    hover:text-[#B89B5E]
                  "
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <input
                id="password"
                required
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                value={form.password}
                onChange={handleChange}
                className="
                  h-14 w-full rounded-2xl
                  border border-transparent
                  bg-[#FFFCF7]
                  px-5
                  text-sm text-[#172B3A]
                  shadow-[0_2px_12px_rgba(23,43,58,0.04)]
                  outline-none
                  placeholder:text-[#A49B90]
                  transition-all duration-200
                  focus:border-[#B89B5E]/40
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#B89B5E]/10
                "
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-[#9B4B45]/8 px-4 py-3 text-center text-xs text-[#9B4B45]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-3
                h-14
                w-full
                rounded-2xl
                bg-[#172B3A]
                px-6
                text-sm
                font-medium
                tracking-wide
                text-white
                shadow-[0_8px_24px_rgba(23,43,58,0.12)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#203C50]
                hover:shadow-[0_12px_28px_rgba(23,43,58,0.16)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-9 text-center">
            <p className="text-sm text-[#81786D]">
              Pas encore de compte ?
            </p>

            <Link
              href="/account/register"
              className="
                mt-2
                inline-block
                text-sm
                font-medium
                text-[#172B3A]
                underline
                decoration-[#B89B5E]
                decoration-1
                underline-offset-4
                transition-colors
                hover:text-[#B89B5E]
              "
            >
              Créer un compte
            </Link>
          </div>

          {/* Bottom detail */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#D8CCBC]" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A49B90]">
              Timeless · Refined · Portovero
            </span>
            <span className="h-px w-10 bg-[#D8CCBC]" />
          </div>

        </div>
      </div>
    </main>
  );
}
