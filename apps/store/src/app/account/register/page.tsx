"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
    <main className="min-h-screen bg-[#F7F3EC] text-[#172B3A]">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center px-6 py-20 sm:px-8">

        {/* Intro */}
        <div className="mb-10 text-center">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#B89B5E]">
            Portovero
          </p>

          <h1 className="font-heading text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
            Create your account
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#81786D]">
            Join Portovero and discover pieces selected for timeless style.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">

          {/* Name */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            <Field
              label="Prénom"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />

            <Field
              label="Nom"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
          </div>

          {/* Phone */}
          <Field
            label="Téléphone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />

          {/* Email */}
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            optional
          />

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#81786D]"
            >
              Mot de passe
            </label>

            <div className="relative">
              <input
                id="password"
                required
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="8 caractères minimum"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                autoComplete="new-password"
                className="
                  w-full
                  border-0
                  border-b
                  border-[#D8CCBC]
                  bg-transparent
                  px-0
                  py-3
                  pr-10
                  text-[15px]
                  text-[#172B3A]
                  outline-none
                  transition
                  placeholder:text-[#AAA095]
                  focus:border-[#172B3A]
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  text-[#8A8176]
                  transition
                  hover:text-[#172B3A]
                "
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>

            <p className="mt-2 text-[11px] text-[#9A9186]">
              Minimum 8 caractères
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-[#F3E4DF] px-4 py-3 text-sm text-[#9B4A3C]">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              group
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-full
              bg-[#172B3A]
              px-6
              py-4
              text-sm
              font-medium
              tracking-wide
              text-white
              transition-all
              duration-300
              hover:bg-[#243D4E]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <span>
              {loading ? "Création du compte..." : "Créer mon compte"}
            </span>

            {!loading && (
              <ArrowRight
                size={17}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            )}
          </button>
        </form>

        {/* Login */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#81786D]">
            Déjà un compte ?{" "}
            <Link
              href="/account/login"
              className="
                font-medium
                text-[#172B3A]
                underline
                decoration-[#B89B5E]
                underline-offset-4
                transition
                hover:text-[#B89B5E]
              "
            >
              Se connecter
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.18em] text-[#AAA095]">
          Timeless pieces · Modern elegance
        </p>
      </div>
    </main>
  );
}

/* -------------------------------------------------------
   Reusable field
------------------------------------------------------- */

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  optional = false,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#81786D]"
      >
        {label}

        {optional && (
          <span className="ml-2 normal-case tracking-normal text-[#AAA095]">
            (optionnel)
          </span>
        )}
      </label>

      <input
        id={name}
        required={required}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="
          w-full
          border-0
          border-b
          border-[#D8CCBC]
          bg-transparent
          px-0
          py-3
          text-[15px]
          text-[#172B3A]
          outline-none
          transition
          placeholder:text-[#AAA095]
          focus:border-[#172B3A]
        "
      />
    </div>
  );
}