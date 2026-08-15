"use client";

import { useEffect, useState } from "react";

import {
  fetchCategories,
  fetchColors,
  fetchSizes,
  Category,
  Color,
  Size,
  ProductPayload,
} from "../lib/api/products";

interface Props {
  initial?: Partial<ProductPayload>;
  onSubmit: (data: ProductPayload) => Promise<void>;
  submitLabel?: string;
}

export function ProductForm({
  initial,
  onSubmit,
  submitLabel = "Enregistrer",
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  const [form, setForm] = useState<ProductPayload>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    base_price: initial?.base_price ?? 0,
    compare_at_price: initial?.compare_at_price ?? null,
    stock: initial?.stock ?? 0,
    weight: initial?.weight ?? null,
    gender: initial?.gender ?? null,

    category_id: initial?.category_id ?? null,
    image_url: initial?.image_url ?? null,

    color_id: initial?.color_id ?? null,
    size_id: initial?.size_id ?? null,

    is_active: initial?.is_active ?? true,
    is_featured: initial?.is_featured ?? false,
    is_new: initial?.is_new ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);

        const [categoriesData, colorsData, sizesData] =
          await Promise.all([
            fetchCategories(),
            fetchColors(),
            fetchSizes(),
          ]);

        setCategories(categoriesData.items);
        setColors(colorsData.items);
        setSizes(sizesData.items);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les options du produit.");
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6"
    >
      {/* NOM */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Nom
        </label>

        <input
          required
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* DESCRIPTION */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={form.description ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          rows={4}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* PRIX */}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Prix de base (DA)
          </label>

          <input
            required
            type="number"
            step="0.01"
            value={form.base_price}
            onChange={(e) =>
              setForm({
                ...form,
                base_price: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Prix barré
          </label>

          <input
            type="number"
            step="0.01"
            value={form.compare_at_price ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                compare_at_price: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* STOCK / POIDS */}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Stock
          </label>

          <input
            required
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Poids (kg)
          </label>

          <input
            type="number"
            step="0.01"
            value={form.weight ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                weight: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* GENRE */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Genre
        </label>

        <select
          value={form.gender ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              gender: e.target.value || null,
            })
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="">
            — Non spécifié —
          </option>

          <option value="men">
            Homme
          </option>

          <option value="women">
            Femme
          </option>

          <option value="unisex">
            Unisexe
          </option>
        </select>
      </div>

      {/* CATEGORIE */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Catégorie
        </label>

        <select
          required
          value={form.category_id ?? ""}
          disabled={loadingOptions}
          onChange={(e) =>
            setForm({
              ...form,
              category_id: e.target.value
                ? Number(e.target.value)
                : null,
            })
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="">
            {loadingOptions
              ? "Chargement..."
              : "— Sélectionner une catégorie —"}
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* COULEUR */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Couleur
        </label>

        <select
          value={form.color_id ?? ""}
          disabled={loadingOptions}
          onChange={(e) =>
            setForm({
              ...form,
              color_id: e.target.value
                ? Number(e.target.value)
                : null,
            })
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="">
            — Sélectionner une couleur —
          </option>

          {colors.map((color) => (
            <option
              key={color.id}
              value={color.id}
            >
              {color.name}
            </option>
          ))}
        </select>
      </div>

      {/* TAILLE */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Taille
        </label>

        <select
          value={form.size_id ?? ""}
          disabled={loadingOptions}
          onChange={(e) =>
            setForm({
              ...form,
              size_id: e.target.value
                ? Number(e.target.value)
                : null,
            })
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="">
            — Sélectionner une taille —
          </option>

          {sizes.map((size) => (
            <option
              key={size.id}
              value={size.id}
            >
              {size.name}
            </option>
          ))}
        </select>
      </div>

      {/* IMAGE */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Image du produit
        </label>

        <input
          type="file"
          accept="image/*"
          className="w-full rounded-lg border p-3"
        />

        {form.image_url && (
          <img
            src={form.image_url}
            alt="Aperçu"
            className="mt-3 h-32 w-32 rounded-lg border object-cover"
          />
        )}
      </div>

      {/* OPTIONS */}

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm({
                ...form,
                is_active: e.target.checked,
              })
            }
          />

          Actif
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm({
                ...form,
                is_featured: e.target.checked,
              })
            }
          />

          Mis en avant
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_new}
            onChange={(e) =>
              setForm({
                ...form,
                is_new: e.target.checked,
              })
            }
          />

          Nouveau
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || loadingOptions}
        className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading
          ? "Enregistrement..."
          : submitLabel}
      </button>
    </form>
  );
}