"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getMe } from "../../lib/api/auth";
import { useAdminAuth } from "../../store/auth";
import { ApiError } from "../../lib/api/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAdminAuth((s) => s.setSession);

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        setError("Impossible de se connecter. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#1c1c1a]">
      <div className="flex min-h-screen">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#20211d] lg:flex lg:w-[52%]">
          {/* Decorative elements */}
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10" />
          <div className="absolute -left-20 -top-20 h-[350px] w-[350px] rounded-full border border-white/10" />

          <div className="absolute bottom-[-180px] right-[-100px] h-[500px] w-[500px] rounded-full border border-white/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-[#c8b898]/60">
                  <span className="font-serif text-xl text-[#c8b898]">
                    P
                  </span>
                </div>

                <div>
                  <p className="font-serif text-xl tracking-[0.2em] text-white">
                    PORTOVERO
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#c8b898]">
                    Administration
                  </p>
                </div>
              </div>

              <div className="max-w-lg pt-20">
                <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#c8b898]">
                  Private Access
                </p>

                <h1 className="font-serif text-5xl leading-[1.05] text-white xl:text-6xl">
                  Manage the
                  <br />
                  <span className="italic text-[#c8b898]">
                    exceptional.
                  </span>
                </h1>

                <p className="mt-8 max-w-md text-sm leading-7 text-white/50">
                  Bienvenue dans l’espace d’administration Portovero.
                  Gérez vos produits, commandes, stocks et performances
                  depuis un espace centralisé.
                </p>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-end justify-between border-t border-white/10 pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                Portovero © 2026
              </p>

              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                Quiet Luxury
              </p>
            </div>
          </div>
        </section>

        {/* LOGIN PANEL */}
        <section className="flex w-full items-center justify-center px-6 py-12 lg:w-[48%] lg:px-12">
          <div className="w-full max-w-[440px]">
            {/* Mobile logo */}
            <div className="mb-14 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-[#1c1c1a]">
                  <span className="font-serif text-xl">P</span>
                </div>

                <div>
                  <p className="font-serif text-xl tracking-[0.2em]">
                    PORTOVERO
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">
                    Administration
                  </p>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500">
                Admin Portal
              </p>

              <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
                Bon retour.
              </h2>

              <p className="mt-4 text-sm leading-6 text-neutral-500">
                Connectez-vous pour accéder à votre espace
                d’administration.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500"
                >
                  Téléphone
                </label>

                <input
                  id="phone"
                  required
                  autoComplete="tel"
                  type="tel"
                  placeholder="0555 55 55 55"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="h-14 w-full border-b border-neutral-300 bg-transparent px-1 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#1c1c1a]"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500"
                >
                  Mot de passe
                </label>

                <div className="relative">
                  <input
                    id="password"
                    required
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="h-14 w-full border-b border-neutral-300 bg-transparent px-1 pr-20 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#1c1c1a]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition hover:text-neutral-900"
                  >
                    {showPassword ? "Masquer" : "Afficher"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                  <p className="text-xs leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-3 flex h-14 w-full items-center justify-center overflow-hidden bg-[#20211d] text-xs font-medium uppercase tracking-[0.25em] text-white transition hover:bg-[#2c2d28] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "Connexion..." : "Se connecter"}
                </span>

                {!loading && (
                  <span className="absolute right-6 text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-10 flex items-center gap-3 border-t border-neutral-200 pt-6">
              <div className="flex h-8 w-8 items-center justify-center border border-neutral-200">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </div>

              <p className="text-[10px] leading-5 text-neutral-400">
                Accès sécurisé réservé aux membres autorisés
                de l’administration Portovero.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}