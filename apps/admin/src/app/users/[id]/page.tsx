"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, UserRound } from "lucide-react";

import {
  fetchUser,
  type User,
} from "@/lib/api/users";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailsPage({
  params,
}: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { id } = await params;

        const result = await fetchUser(
          Number(id)
        );

        setUser(result);
      } catch (err) {
        console.error(err);
        setError(
          "Impossible de charger cet utilisateur."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4 p-6">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux utilisateurs
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Utilisateur introuvable."}
        </div>
      </div>
    );
  }

  const createdDate = new Date(
    user.created_at
  ).toLocaleDateString("fr-FR");

  const updatedDate = new Date(
    user.updated_at
  ).toLocaleDateString("fr-FR");

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
      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-semibold text-white">
          {user.first_name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">
            {user.first_name}{" "}
            {user.last_name}
          </h1>

          <p className="text-sm text-muted-foreground">
            Utilisateur #{user.id}
          </p>
        </div>

      </div>

      {/* STATUS */}
      <div className="flex flex-wrap gap-2">

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            user.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.is_active
            ? "Compte actif"
            : "Compte inactif"}
        </span>

        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {user.is_registered
            ? "Utilisateur inscrit"
            : "Utilisateur invité"}
        </span>

        {user.is_admin && (
          <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
            Administrateur
          </span>
        )}

      </div>

      {/* INFORMATION */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* PERSONAL */}
        <section className="rounded-xl border bg-background p-6">

          <div className="mb-5 flex items-center gap-2">
            <UserRound className="h-5 w-5" />

            <h2 className="font-semibold">
              Informations personnelles
            </h2>
          </div>

          <div className="space-y-4">

            <Info
              label="Prénom"
              value={user.first_name}
            />

            <Info
              label="Nom"
              value={user.last_name}
            />

            <Info
              label="Téléphone"
              value={user.phone}
              icon={<Phone className="h-4 w-4" />}
            />

            <Info
              label="Email"
              value={user.email || "Non renseigné"}
              icon={<Mail className="h-4 w-4" />}
            />

          </div>
        </section>

        {/* ACCOUNT */}
        <section className="rounded-xl border bg-background p-6">

          <h2 className="mb-5 font-semibold">
            Informations du compte
          </h2>

          <div className="space-y-4">

            <Info
              label="ID utilisateur"
              value={`#${user.id}`}
            />

            <Info
              label="Créé le"
              value={createdDate}
            />

            <Info
              label="Dernière modification"
              value={updatedDate}
            />

            <Info
              label="Marketing"
              value={
                user.marketing_consent
                  ? "Consentement donné"
                  : "Pas de consentement"
              }
            />

          </div>
        </section>

      </div>

      {/* FUTURE SECTIONS */}
      <section className="rounded-xl border bg-background p-6">

        <h2 className="mb-2 font-semibold">
          Activité
        </h2>

        <p className="text-sm text-muted-foreground">
          Les commandes, adresses, wishlist et
          avis pourront être affichés ici.
        </p>

      </section>

    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">
        {label}
      </p>

      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {value}
      </div>
    </div>
  );
}