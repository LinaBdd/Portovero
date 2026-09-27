"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { ApiError } from "@/lib/api/client";
import {
  fetchUser,
  updateUser,
  type UpdateUserPayload,
  type User,
} from "@/lib/api/users";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

interface FormState {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  is_active: boolean;
  is_admin: boolean;
}

const inputClassName =
  "h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-black/10";

function toFormState(user: User): FormState {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    email: user.email ?? "",
    password: "",
    is_active: user.is_active,
    is_admin: user.is_admin,
  };
}

// « 0540 15 46 91 » → « 0540154691 »
function normalizePhone(phone: string) {
  return phone.replace(/[\s.-]/g, "");
}

// Ne garde que ce qui a changé : les champs non touchés ne sont pas envoyés
function getChanges(user: User, form: FormState): UpdateUserPayload {
  const changes: UpdateUserPayload = {};

  const firstName = form.first_name.trim();
  const lastName = form.last_name.trim();
  const phone = normalizePhone(form.phone);
  const email = form.email.trim() || null;

  if (firstName !== user.first_name) changes.first_name = firstName;
  if (lastName !== user.last_name) changes.last_name = lastName;
  if (phone !== normalizePhone(user.phone)) changes.phone = phone;
  if (email !== user.email) changes.email = email;
  if (form.password) changes.password = form.password;
  if (form.is_active !== user.is_active) changes.is_active = form.is_active;
  if (form.is_admin !== user.is_admin) changes.is_admin = form.is_admin;

  return changes;
}

// Mêmes règles que le backend, appliquées aux seuls champs modifiés
function validate(changes: UpdateUserPayload): string | null {
  if (changes.first_name !== undefined && changes.first_name.length < 2) {
    return "Le prénom doit contenir au moins 2 caractères.";
  }

  if (changes.last_name !== undefined && changes.last_name.length < 2) {
    return "Le nom doit contenir au moins 2 caractères.";
  }

  if (changes.phone !== undefined && !/^\+?\d{10,19}$/.test(changes.phone)) {
    return "Le numéro de téléphone doit contenir au moins 10 chiffres.";
  }

  if (changes.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.email)) {
    return "L'adresse email n'est pas valide.";
  }

  if (changes.password !== undefined && changes.password.length < 8) {
    return "Le nouveau mot de passe doit contenir au moins 8 caractères.";
  }

  return null;
}

// Traduit les erreurs renvoyées par l'API
function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 404) {
      return "Cet utilisateur n'existe plus.";
    }

    if (err.status === 422) {
      return "Certains champs ne sont pas valides. Vérifiez le formulaire.";
    }

    if (err.status === 400) {
      try {
        const detail = JSON.parse(err.message)?.detail;

        // Les messages de la route de modification sont déjà en français
        if (typeof detail === "string") {
          return detail;
        }
      } catch {
        // Réponse non JSON : message générique plus bas
      }
    }
  }

  return "Impossible d'enregistrer les modifications. Réessayez.";
}

export default function EditUserPage({
  params,
}: Props) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { id } = await params;
        const userId = Number(id);

        if (!Number.isInteger(userId) || userId <= 0) {
          setLoadError("Utilisateur introuvable.");
          return;
        }

        const result = await fetchUser(userId);

        setUser(result);
        setForm(toFormState(result));
      } catch (err) {
        console.error(err);
        setLoadError(
          err instanceof ApiError && err.status === 404
            ? "Utilisateur introuvable."
            : "Impossible de charger cet utilisateur."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

  function update<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((current) =>
      current ? { ...current, [key]: value } : current
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !form) return;

    const changes = getChanges(user, form);

    // Rien n'a changé : retour direct à la fiche
    if (Object.keys(changes).length === 0) {
      router.push(`/users/${user.id}`);
      return;
    }

    const validationError = validate(changes);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await updateUser(user.id, changes);

      // Le bouton reste désactivé pendant la redirection
      router.push(`/users/${user.id}`);
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(getErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (loadError || !user || !form) {
    return (
      <div className="space-y-4 p-6">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux utilisateurs
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError || "Utilisateur introuvable."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* BACK */}
      <Link
        href={`/users/${user.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la fiche
      </Link>

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Modifier {user.first_name} {user.last_name}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Utilisateur #{user.id}
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
              autoComplete="off"
              className={inputClassName}
            />
          </Field>

          <Field
            label="Email (optionnel)"
            htmlFor="email"
            hint="Laissez vide pour retirer l'email."
          >
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
          label="Nouveau mot de passe (optionnel)"
          htmlFor="password"
          hint={
            user.is_registered
              ? "Laissez vide pour garder le mot de passe actuel. 8 caractères minimum."
              : "Compte invité : définir un mot de passe lui permettra de se connecter. 8 caractères minimum."
          }
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

        {/* STATUS */}
        <div className="space-y-3">

          <CheckboxCard
            label="Compte actif"
            description="Décochez pour désactiver le compte."
            checked={form.is_active}
            onChange={(checked) => update("is_active", checked)}
          />

          <CheckboxCard
            label="Administrateur"
            description="Donne accès à ce panneau d'administration."
            checked={form.is_admin}
            onChange={(checked) => update("is_admin", checked)}
          />

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            href={`/users/${user.id}`}
            className="inline-flex h-11 items-center rounded-lg border px-4 text-sm font-medium transition hover:bg-muted"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
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

function CheckboxCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-muted/30">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-black"
      />

      <span>
        <span className="block text-sm font-medium">
          {label}
        </span>

        <span className="mt-0.5 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
    </label>
  );
}