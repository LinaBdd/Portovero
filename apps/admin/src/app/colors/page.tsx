"use client";

import { useEffect, useState } from "react";
import {
  fetchColors,
  createColor,
  updateColor,
  deleteColor,
  type Color,
} from "@/lib/api/colors";

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState("#000000");

  const [saving, setSaving] = useState(false);

  async function loadColors() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchColors();

      setColors(response.items);
    } catch (err) {
      console.error("Failed to load colors:", err);
      setError("Impossible de charger les couleurs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadColors();
  }, []);

  function openCreateForm() {
    setEditingColor(null);
    setName("");
    setHexCode("#000000");
    setShowForm(true);
  }

  function openEditForm(color: Color) {
    setEditingColor(color);
    setName(color.name);
    setHexCode(color.hex_code);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingColor(null);
    setName("");
    setHexCode("#000000");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Le nom de la couleur est obligatoire.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingColor) {
        await updateColor(editingColor.id, {
          name: name.trim(),
          hex_code: hexCode,
        });
      } else {
        await createColor({
          name: name.trim(),
          hex_code: hexCode,
        });
      }

      closeForm();
      await loadColors();
    } catch (err) {
      console.error("Failed to save color:", err);
      setError(
        "Impossible d'enregistrer la couleur. Elle existe peut-être déjà."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(color: Color) {
    const confirmed = window.confirm(
      `Supprimer la couleur "${color.name}" ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteColor(color.id);

      await loadColors();
    } catch (err) {
      console.error("Failed to delete color:", err);
      setError(
        "Impossible de supprimer cette couleur."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f1] px-8 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-[#111]">
              Couleurs
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Gérez les couleurs disponibles pour vos produits.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            + Ajouter une couleur
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-[#dedbd5] bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-2xl text-[#111]">
              {editingColor
                ? "Modifier la couleur"
                : "Ajouter une couleur"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nom
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Ex: Beige"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Code hexadécimal
                </label>

                <div className="flex gap-3">
                  <input
                    type="color"
                    value={hexCode}
                    onChange={(e) =>
                      setHexCode(e.target.value.toUpperCase())
                    }
                    className="h-12 w-16 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
                  />

                  <input
                    type="text"
                    value={hexCode}
                    onChange={(e) =>
                      setHexCode(e.target.value.toUpperCase())
                    }
                    placeholder="#000000"
                    maxLength={7}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm uppercase outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving
                    ? "Enregistrement..."
                    : editingColor
                    ? "Enregistrer"
                    : "Ajouter"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#dedbd5] bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Chargement des couleurs...
            </div>
          ) : colors.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-serif text-xl text-gray-800">
                Aucune couleur
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Commencez par ajouter une couleur.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#faf9f7] text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Couleur
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Nom
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Code
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {colors.map((color) => (
                    <tr
                      key={color.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-[#faf9f7]"
                    >
                      <td className="px-6 py-5">
                        <div
                          className="h-9 w-9 rounded-full border border-gray-300 shadow-sm"
                          style={{
                            backgroundColor:
                              color.hex_code,
                          }}
                          title={color.hex_code}
                        />
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-gray-900">
                        {color.name}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-md bg-gray-100 px-3 py-1 font-mono text-xs text-gray-600">
                          {color.hex_code}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditForm(color)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(color)
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
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