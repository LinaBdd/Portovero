"use client";

import { useEffect, useState } from "react";
import {
  fetchSizes,
  createSize,
  updateSize,
  deleteSize,
  type Size,
} from "@/lib/api/sizes";

export default function SizesPage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  async function loadSizes() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchSizes();

      setSizes(response.items);
    } catch (err) {
      console.error("Failed to load sizes:", err);

      setError(
        "Impossible de charger les tailles."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSizes();
  }, []);

  function openCreateForm() {
    setEditingSize(null);
    setName("");

    // Propose automatiquement le prochain ordre
    setDisplayOrder(sizes.length);

    setError(null);
    setShowForm(true);
  }

  function openEditForm(size: Size) {
    setEditingSize(size);
    setName(size.name);
    setDisplayOrder(size.display_order);

    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingSize(null);
    setName("");
    setDisplayOrder(0);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError(
        "Le nom de la taille est obligatoire."
      );
      return;
    }

    if (displayOrder < 0) {
      setError(
        "L'ordre d'affichage doit être positif."
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingSize) {
        await updateSize(editingSize.id, {
          name: trimmedName,
          display_order: displayOrder,
        });
      } else {
        await createSize({
          name: trimmedName,
          display_order: displayOrder,
        });
      }

      closeForm();

      await loadSizes();
    } catch (err) {
      console.error("Failed to save size:", err);

      setError(
        "Impossible d'enregistrer cette taille. Elle existe peut-être déjà."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(size: Size) {
    const confirmed = window.confirm(
      `Supprimer la taille "${size.name}" ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteSize(size.id);

      await loadSizes();
    } catch (err) {
      console.error(
        "Failed to delete size:",
        err
      );

      setError(
        "Impossible de supprimer cette taille."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f1] px-8 py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-[#111]">
              Tailles
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Gérez les tailles disponibles pour vos produits.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            + Ajouter une taille
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-[#dedbd5] bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-2xl text-[#111]">
              {editingSize
                ? "Modifier la taille"
                : "Ajouter une taille"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Taille
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Ex: S, M, L, XL"
                  maxLength={20}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              {/* DISPLAY ORDER */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ordre d'affichage
                </label>

                <input
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(event) =>
                    setDisplayOrder(
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Plus le nombre est petit, plus la taille
                  apparaît en premier.
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
                >
                  {saving
                    ? "Enregistrement..."
                    : editingSize
                    ? "Enregistrer"
                    : "Ajouter"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-[#dedbd5] bg-white shadow-sm">

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Chargement des tailles...
            </div>
          ) : sizes.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-serif text-xl text-gray-800">
                Aucune taille
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Commencez par ajouter une taille.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead>
                  <tr className="border-b border-gray-200 bg-[#faf9f7] text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Ordre
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Taille
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      ID
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {sizes.map((size) => (
                    <tr
                      key={size.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-[#faf9f7]"
                    >

                      {/* ORDER */}
                      <td className="px-6 py-5">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-600">
                          {size.display_order}
                        </span>
                      </td>

                      {/* SIZE */}
                      <td className="px-6 py-5">
                        <span className="inline-flex min-w-[50px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                          {size.name}
                        </span>
                      </td>

                      {/* ID */}
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs text-gray-400">
                          #{size.id}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditForm(size)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(size)
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Supprimer
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}