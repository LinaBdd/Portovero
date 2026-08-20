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
  ProductColorPayload,
  ProductVariantPayload,
} from "../lib/api/products";

interface Props {
  initial?: Partial<ProductPayload>;
  onSubmit: (data: ProductPayload) => Promise<void>;
  submitLabel?: string;
}

interface SelectedColor {
  color_id: number;
  image_url: string;
}

interface SelectedVariant {
  color_id: number;
  size_id: number;
  stock: number;
  price: number;
  old_price: number | null;
  is_active: boolean;
}

export function ProductForm({
  initial,
  onSubmit,
  submitLabel = "Enregistrer",
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",

    base_price: initial?.base_price ?? 0,
    compare_at_price: initial?.compare_at_price ?? null,

    stock: initial?.stock ?? 0,
    weight: initial?.weight ?? null,

    gender: initial?.gender ?? null,

    category_id: initial?.category_id ?? null,

    is_active: initial?.is_active ?? true,
    is_featured: initial?.is_featured ?? false,
    is_new: initial?.is_new ?? false,
  });

  /*
   * Couleurs sélectionnées
   */
  const [selectedColors, setSelectedColors] = useState<SelectedColor[]>(
    []
  );

  /*
   * Variantes sélectionnées
   */
  const [variants, setVariants] = useState<SelectedVariant[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * =========================================================
   * CHARGER CATEGORIES / COULEURS / TAILLES
   * =========================================================
   */

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);

        const [categoriesResponse, colorsResponse, sizesResponse] =
          await Promise.all([
            fetchCategories(),
            fetchColors(),
            fetchSizes(),
          ]);

        setCategories(categoriesResponse.items);
        setColors(colorsResponse.items);
        setSizes(sizesResponse.items);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les catégories, couleurs et tailles.");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  /*
   * =========================================================
   * AJOUTER UNE COULEUR
   * =========================================================
   */

  function addColor(colorId: number) {
    if (!colorId) return;

    const alreadyExists = selectedColors.some(
      (color) => color.color_id === colorId
    );

    if (alreadyExists) return;

    setSelectedColors((current) => [
      ...current,
      {
        color_id: colorId,
        image_url: "",
      },
    ]);
  }

  /*
   * =========================================================
   * SUPPRIMER UNE COULEUR
   * =========================================================
   */

  function removeColor(colorId: number) {
    setSelectedColors((current) =>
      current.filter((color) => color.color_id !== colorId)
    );

    /*
     * Supprimer également les variantes
     * appartenant à cette couleur.
     */
    setVariants((current) =>
      current.filter((variant) => variant.color_id !== colorId)
    );
  }

  /*
   * =========================================================
   * IMAGE D'UNE COULEUR
   * =========================================================
   */

  function updateColorImage(colorId: number, imageUrl: string) {
    setSelectedColors((current) =>
      current.map((color) =>
        color.color_id === colorId
          ? {
              ...color,
              image_url: imageUrl,
            }
          : color
      )
    );
  }

  /*
   * =========================================================
   * AJOUTER UNE VARIANTE
   * =========================================================
   */

  function addVariant(colorId: number, sizeId: number) {
    if (!colorId || !sizeId) return;

    const alreadyExists = variants.some(
      (variant) =>
        variant.color_id === colorId &&
        variant.size_id === sizeId
    );

    if (alreadyExists) return;

    setVariants((current) => [
      ...current,
      {
        color_id: colorId,
        size_id: sizeId,
        stock: 0,
        price: Number(form.base_price) || 0,
        old_price: form.compare_at_price,
        is_active: true,
      },
    ]);
  }

  /*
   * =========================================================
   * SUPPRIMER VARIANTE
   * =========================================================
   */

  function removeVariant(colorId: number, sizeId: number) {
    setVariants((current) =>
      current.filter(
        (variant) =>
          !(
            variant.color_id === colorId &&
            variant.size_id === sizeId
          )
      )
    );
  }

  /*
   * =========================================================
   * MODIFIER VARIANTE
   * =========================================================
   */

  function updateVariant(
    colorId: number,
    sizeId: number,
    field: keyof SelectedVariant,
    value: number | boolean | null
  ) {
    setVariants((current) =>
      current.map((variant) =>
        variant.color_id === colorId &&
        variant.size_id === sizeId
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  }

  /*
   * =========================================================
   * CREATION
   * =========================================================
   */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    /*
     * Vérifications
     */

    if (!form.name.trim()) {
      setError("Le nom du produit est obligatoire.");
      return;
    }

    if (!form.category_id) {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }

    if (selectedColors.length === 0) {
      setError("Veuillez sélectionner au moins une couleur.");
      return;
    }

    if (variants.length === 0) {
      setError("Veuillez ajouter au moins une variante.");
      return;
    }

    /*
     * Vérifier que chaque couleur possède une image
     */

    const colorWithoutImage = selectedColors.find(
      (color) => !color.image_url.trim()
    );

    if (colorWithoutImage) {
      const color = colors.find(
        (item) => item.id === colorWithoutImage.color_id
      );

      setError(
        `Veuillez ajouter une image pour la couleur ${
          color?.name ?? ""
        }.`
      );

      return;
    }

    setLoading(true);

    try {
      /*
       * =====================================================
       * CONSTRUIRE LES COULEURS
       * =====================================================
       */

      const colorsPayload: ProductColorPayload[] =
        selectedColors.map((color) => ({
          color_id: color.color_id,

          images: [
            {
              url: color.image_url,
              alt: form.name,
              position: 0,
              is_primary: true,
            },
          ],
        }));

      /*
       * =====================================================
       * CONSTRUIRE LES VARIANTES
       * =====================================================
       */

      const variantsPayload: ProductVariantPayload[] =
        variants.map((variant) => ({
          color_id: variant.color_id,
          size_id: variant.size_id,
          stock: variant.stock,
          price: variant.price,
          old_price: variant.old_price,
          is_active: variant.is_active,
        }));

      /*
       * =====================================================
       * STOCK TOTAL
       *
       * Le stock du produit est calculé automatiquement
       * à partir des variantes.
       * =====================================================
       */

      const totalStock = variants.reduce(
        (total, variant) => total + variant.stock,
        0
      );

      /*
       * =====================================================
       * PAYLOAD FINAL
       * =====================================================
       */

      const payload: ProductPayload = {
        name: form.name,

        description: form.description || null,

        base_price: Number(form.base_price),

        compare_at_price:
          form.compare_at_price !== null
            ? Number(form.compare_at_price)
            : null,

        stock: totalStock,

        weight:
          form.weight !== null
            ? Number(form.weight)
            : null,

        gender: form.gender || null,

        category_id: form.category_id,

        colors: colorsPayload,

        variants: variantsPayload,

        is_active: form.is_active,

        is_featured: form.is_featured,

        is_new: form.is_new,
      };

      console.log("CREATE PRODUCT PAYLOAD:", payload);

      await onSubmit(payload);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du produit.");
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loadingData) {
    return (
      <div className="rounded-lg border p-6">
        Chargement des catégories, couleurs et tailles...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl space-y-8"
    >
      {/* =====================================================
          INFORMATIONS GENERALES
      ===================================================== */}

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">
          Informations générales
        </h2>

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
              min="0"
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
              min="0"
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

        {/* POIDS */}

        <div>
          <label className="mb-1 block text-sm font-medium">
            Poids (kg)
          </label>

          <input
            type="number"
            min="0"
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
              Men
            </option>

            <option value="women">
              Women
            </option>

            <option value="unisex">
              Unisex
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
              — Sélectionner une catégorie —
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
      </div>

      {/* =====================================================
          COULEURS
      ===================================================== */}

      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">
            Couleurs
          </h2>

          <p className="text-sm text-neutral-500">
            Sélectionnez les couleurs disponibles pour ce produit.
          </p>
        </div>

        {/* SELECT COULEUR */}

        <select
          value=""
          onChange={(e) =>
            addColor(Number(e.target.value))
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="">
            + Ajouter une couleur
          </option>

          {colors
            .filter(
              (color) =>
                !selectedColors.some(
                  (selected) =>
                    selected.color_id === color.id
                )
            )
            .map((color) => (
              <option
                key={color.id}
                value={color.id}
              >
                {color.name}
              </option>
            ))}
        </select>

        {/* COULEURS */}

        <div className="space-y-4">
          {selectedColors.map((selectedColor) => {
            const color = colors.find(
              (item) =>
                item.id === selectedColor.color_id
            );

            return (
              <div
                key={selectedColor.color_id}
                className="rounded-lg border p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">
                    {color?.name}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeColor(selectedColor.color_id)
                    }
                    className="text-sm text-red-600"
                  >
                    Supprimer
                  </button>
                </div>

                {/* IMAGE */}
                

               <label className="mb-1 block text-sm font-medium">
                 Image du produit
               </label>

               <input
                 type="file"
                 accept="image/*"
                 onChange={async (e) => {
                   const file = e.target.files?.[0];

                   if (!file) return;

                   try {
                     // Pour l'instant : aperçu local
                     const previewUrl = URL.createObjectURL(file);

                     updateColorImage(
                       selectedColor.color_id,
                       previewUrl
                     );
                   } catch (error) {
                     console.error("Erreur lors de la sélection de l'image :", error);
                   }
                 }}
                 className="w-full rounded-lg border p-3"
               />
               
               {selectedColor.image_url && (
                 <img
                   src={selectedColor.image_url}
                   alt={color?.name ?? ""}
                   className="mt-3 h-32 w-32 rounded-lg border object-cover"
                 />
               )}

              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          VARIANTES
      ===================================================== */}

      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">
            Variantes
          </h2>

          <p className="text-sm text-neutral-500">
            Une variante correspond à une combinaison couleur + taille.
          </p>
        </div>

        {/* AJOUT VARIANTE */}

        {selectedColors.length > 0 && sizes.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {selectedColors.map((color) => {
              const colorInfo = colors.find(
                (item) =>
                  item.id === color.color_id
              );

              return (
                <div
                  key={color.color_id}
                  className="rounded-lg border p-4"
                >
                  <h3 className="mb-3 font-medium">
                    {colorInfo?.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map((size) => {
                      const exists = variants.some(
                        (variant) =>
                          variant.color_id ===
                            color.color_id &&
                          variant.size_id === size.id
                      );

                      return (
                        <button
                          key={size.id}
                          type="button"
                          disabled={exists}
                          onClick={() =>
                            addVariant(
                              color.color_id,
                              size.id
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm disabled:bg-neutral-100 disabled:text-neutral-400"
                        >
                          {size.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LISTE VARIANTES */}

        <div className="space-y-3">
          {variants.map((variant) => {
            const color = colors.find(
              (item) =>
                item.id === variant.color_id
            );

            const size = sizes.find(
              (item) =>
                item.id === variant.size_id
            );

            return (
              <div
                key={`${variant.color_id}-${variant.size_id}`}
                className="rounded-lg border p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {color?.name} / {size?.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(
                        variant.color_id,
                        variant.size_id
                      )
                    }
                    className="text-sm text-red-600"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* STOCK */}

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Stock
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(
                          variant.color_id,
                          variant.size_id,
                          "stock",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border p-2"
                    />
                  </div>

                  {/* PRIX */}

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Prix
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(
                          variant.color_id,
                          variant.size_id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border p-2"
                    />
                  </div>

                  {/* OLD PRICE */}

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Ancien prix
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.old_price ?? ""}
                      onChange={(e) =>
                        updateVariant(
                          variant.color_id,
                          variant.size_id,
                          "old_price",
                          e.target.value
                            ? Number(e.target.value)
                            : null
                        )
                      }
                      className="w-full rounded-lg border p-2"
                    />
                  </div>
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={variant.is_active}
                    onChange={(e) =>
                      updateVariant(
                        variant.color_id,
                        variant.size_id,
                        "is_active",
                        e.target.checked
                      )
                    }
                  />

                  Variante active
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          OPTIONS
      ===================================================== */}

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

      {/* =====================================================
          ERREUR
      ===================================================== */}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* =====================================================
          SUBMIT
      ===================================================== */}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading
          ? "Création du produit..."
          : submitLabel}
      </button>
    </form>
  );
}