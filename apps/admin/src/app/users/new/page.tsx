"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { ApiError } from "@/lib/api/client";
import { createUser } from "@/lib/api/users";

interface FormState {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  is_admin: boolean;
}

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
  is_admin: false,
};

const inputClassName =
  "h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-black/10";

// « 0540 15 46 91 » → « 0540154691 »
function normalizePhone(phone: string) {
  return phone.replace(/[\s.-]/g, "");
}

// Mêmes règles que le backend, pour afficher l'erreur avant l'envoi
function validate(form: FormState): string | null {
  if (form.first_name.trim().length < 2) {
    return "Le prénom doit contenir au moins 2 caractères.";
  }

  if (form.last_name.trim().length < 2) {
    return "Le nom doit contenir au moins 2 caractères.";
  }

  if (!/^\+?\d{10,19}$/.test(normalizePhone(form.phone))) {
    return "Le numéro de téléphone doit contenir au moins 10 chiffres.";
  }

  const email = form.email.trim();

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "L'adresse email n'est pas valide.";
  }

  if (form.password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }

  return null;
}

// Traduit les erreurs renvoyées par l'API
function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    let detail: unknown = null;

    try {
      detail = JSON.parse(err.message)?.detail;
    } catch {
      // Réponse non JSON : message générique plus bas
    }

    if (detail === "Phone already registered.") {
      return "Ce numéro de téléphone est déjà utilisé par un autre compte.";
    }

    if (detail === "Email already registered.") {
      return "Cette adresse email est déjà utilisée par un autre compte.";
    }

    if (err.status === 422) {
      return "Certains champs ne sont pas valides. Vérifiez le formulaire.";
    }
  }

  return "Impossible de créer l'utilisateur. Réessayez.";
}

export default function NewUserPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validate(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const user = await createUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: normalizePhone(form.phone),
        email: form.email.trim() || null,
        password: form.password,
        is_admin: form.is_admin,
      });

      // Le bouton reste désactivé pendant la redirection
      router.push(`/users/${user.id}`);
    } catch (err) {
      console.error("Failed to create user:", err);
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 p-6">

      {/* BACK */}
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux utilisateurs
      </Link>

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Nouvel utilisateur
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Créez un compte client ou administrateur.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl space-y-6 rounded-xl border bg-background p-6"
      >

        {/* ERROR */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* IDENTITY */}
        <div className="grid gap-5 sm:grid-cols-2">

          <Field label="Prénom" htmlFor="first_name">
            <input
              id="first_name"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              maxLength={50}
              autoComplete="off"
              className={inputClassName}
            />
          </Field>

          <Field label="Nom" htmlFor="last_name">
            <input
              id="last_name"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
              maxLength={50}
              autoComplete="off"
              className={inputClassName}
            />
          </Field>

          <Field label="Téléphone" htmlFor="phone">
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="05XX XX XX XX"
              autoComplete="off"
              className={inputClassName}
            />
          </Field>

          <Field label="Email (optionnel)" htmlFor="email">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              maxLength={255}
              autoComplete="off"
              className={inputClassName}
            />
          </Field>

        </div>

        {/* PASSWORD */}
        <Field
          label="Mot de passe"
          htmlFor="password"
          hint="8 caractères minimum. Communiquez-le à l'utilisateur pour sa première connexion."
        >
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              maxLength={128}
              autoComplete="new-password"
              className={`${inputClassName} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        {/* ROLE */}
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-muted/30">
          <input
            type="checkbox"
            checked={form.is_admin}
            onChange={(e) => update("is_admin", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-black"
          />

          <span>
            <span className="block text-sm font-medium">
              Administrateur
            </span>

            <span className="mt-0.5 block text-xs text-muted-foreground">
              Donne accès à ce panneau d&apos;administration.
            </span>
          </span>
        </label>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            href="/users"
            className="inline-flex h-11 items-center rounded-lg border px-4 text-sm font-medium transition hover:bg-muted"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Création..." : "Créer l'utilisateur"}
          </button>
        </div>

      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium"
      >
        {label}
      </label>

      {children}

      {hint && (
        <p className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}