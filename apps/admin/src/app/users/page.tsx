"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  ChevronRight,
} from "lucide-react";

import {
  fetchUsers,
  type User,
} from "@/lib/api/users";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await fetchUsers();

    setUsers(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load users:", error);
    setUsers([]);
    setError("Impossible de charger les utilisateurs.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Utilisateurs
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les utilisateurs de votre boutique.
          </p>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-lg border bg-background px-4">
          <Users className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm font-medium">
            {total} utilisateur{total > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-5 py-4 text-left font-medium">
                  Utilisateur
                </th>

                <th className="px-5 py-4 text-left font-medium">
                  Téléphone
                </th>

                <th className="px-5 py-4 text-left font-medium">
                  Email
                </th>

                <th className="px-5 py-4 text-left font-medium">
                  Statut
                </th>

                <th className="px-5 py-4 text-left font-medium">
                  Inscription
                </th>

                <th className="px-5 py-4" />
              </tr>
            </thead>

            <tbody className="divide-y">

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    Chargement...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-muted/30"
                  >
                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                          {user.first_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium">
                            {user.first_name}{" "}
                            {user.last_name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            #{user.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* PHONE */}
                    <td className="px-5 py-4">
                      {user.phone || "—"}
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4">
                      {user.email || "—"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active
                          ? "Actif"
                          : "Inactif"}
                      </span>
                    </td>

                    {/* REGISTERED */}
                    <td className="px-5 py-4">
                      {user.is_registered ? (
                        <span className="text-green-600">
                          Inscrit
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Invité
                        </span>
                      )}
                    </td>

                    {/* DETAILS */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/users/${user.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}