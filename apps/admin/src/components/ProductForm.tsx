"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  fetchCategories,
  fetchColors,
  fetchSizes,
  uploadProductImage,
  Category,
  Color,
  Size,
  ProductPayload,
  ProductColorPayload,
  ProductVariantPayload,
} from "../lib/api/products";

import { ApiError } from "../lib/api/client";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

interface InitialColor {
  color_id: number;

  images?: {
    url: string;
    alt?: string | null;
    position: number;
    is_primary: boolean;
  }[];
}

interface InitialVariant {
  id?: number;

  color_id: number;
  size_id: number;

  stock: number;
  price: number;
  old_price: number | null;
  is_active: boolean;
}

interface ProductFormInitial {
  name?: string;
  description?: string | null;

  base_price?: number;
  compare_at_price?: number | null;
  cost_price?: number | null;

  stock?: number;
  weight?: number | null;

  gender?: string | null;
  category_id?: number | null;

  colors?: InitialColor[];
  variants?: InitialVariant[];

  is_active?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
}

interface Props {
  initial?: ProductFormInitial;

  onSubmit: (data: ProductPayload) => Promise<void>;

  submitLabel?: string;
}

interface SelectedColor {
  color_id: number;

  /**
   * URL utilisée pour l'affichage.
   *
   * Peut être :
   * - URL existante venant du backend
   * - blob URL créée localement pour preview
   */
  image_url: string;

  /**
   * Fichier sélectionné localement.
   *
   * null = aucune nouvelle image.
   */
  file: File | null;
}

interface SelectedVariant {
  /**
   * Très important en édition :
   * on garde l'id existant.
   */
  id?: number;

  color_id: number;
  size_id: number;

  stock: number;
  price: number;
  old_price: number | null;

  is_active: boolean;
}

/**
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export function ProductForm({
  initial,
  onSubmit,
  submitLabel = "Enregistrer",
}: Props) {
  /**
   * ==========================================================
   * DATA
   * ==========================================================
   */

  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  /**
   * ==========================================================
   * FORM
   * ==========================================================
   */

  const [form, setForm] = useState({
    name: initial?.name ?? "",

    description: initial?.description ?? "",

    base_price: initial?.base_price ?? 0,

    compare_at_price:
      initial?.compare_at_price ?? null,

    cost_price:
      initial?.cost_price ?? null,

    stock: initial?.stock ?? 0,

    weight:
      initial?.weight ?? null,

    gender:
      initial?.gender ?? null,

    category_id:
      initial?.category_id ?? null,

    is_active:
      initial?.is_active ?? true,

    is_featured:
      initial?.is_featured ?? false,

    is_new:
      initial?.is_new ?? false,
  });

  /**
   * ==========================================================
   * COULEURS
   * ==========================================================
   */

  const [selectedColors, setSelectedColors] =
    useState<SelectedColor[]>([]);

  /**
   * ==========================================================
   * VARIANTES
   * ==========================================================
   */

  const [variants, setVariants] =
    useState<SelectedVariant[]>([]);

  /**
   * ==========================================================
   * STATES
   * ==========================================================
   */

  const [loadingData, setLoadingData] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * ==========================================================
   * INITIALISATION
   * ==========================================================
   *
   * Important pour l'édition :
   *
   * EditProductPage charge le produit de manière asynchrone.
   *
   * On doit donc synchroniser le formulaire lorsque `initial`
   * arrive ou change.
   */

  useEffect(() => {
    setForm({
      name: initial?.name ?? "",

      description: initial?.description ?? "",

      base_price: initial?.base_price ?? 0,

      compare_at_price:
        initial?.compare_at_price ?? null,

      cost_price:
        initial?.cost_price ?? null,

      stock: initial?.stock ?? 0,

      weight:
        initial?.weight ?? null,

      gender:
        initial?.gender ?? null,

      category_id:
        initial?.category_id ?? null,

      is_active:
        initial?.is_active ?? true,

      is_featured:
        initial?.is_featured ?? false,

      is_new:
        initial?.is_new ?? false,
    });

    /**
     * Charger les couleurs existantes.
     */

    setSelectedColors(
      (initial?.colors ?? []).map((color) => {
        /**
         * On cherche l'image principale.
         *
         * Si aucune image principale n'existe,
         * on prend la première.
         */

        const primaryImage =
          color.images?.find(
            (image) => image.is_primary
          ) ??
          color.images?.[0];

        return {
          color_id: color.color_id,

          image_url:
            primaryImage?.url ?? "",

          file: null,
        };
      })
    );

    /**
     * Charger les variantes existantes.
     */

    setVariants(
      (initial?.variants ?? []).map(
        (variant) => ({
          id: variant.id,

          color_id: variant.color_id,

          size_id: variant.size_id,

          stock: Number.isFinite(Number(variant.stock))
            ? Number(variant.stock)
            : 0,

          price: Number.isFinite(Number(variant.price))
            ? Number(variant.price)
            : 0,
          old_price:
            variant.old_price !== null &&
            variant.old_price !== undefined
              ? Number(variant.old_price)
              : null,

          is_active:
            variant.is_active ?? true,
        })
      )
    );
  }, [initial]);

  /**
   * ==========================================================
   * CHARGER CATEGORIES / COULEURS / TAILLES
   * ==========================================================
   */

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        setError(null);

        const [
          categoriesResponse,
          colorsResponse,
          sizesResponse,
        ] = await Promise.all([
          fetchCategories(),
          fetchColors(),
          fetchSizes(),
        ]);

        setCategories(
          categoriesResponse.items
        );

        setColors(
          colorsResponse.items
        );

        setSizes(
          sizesResponse.items
        );
      } catch (err) {
        console.error(err);

        setError(
          "Impossible de charger les catégories, couleurs et tailles."
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  /**
   * ==========================================================
   * AJOUTER UNE COULEUR
   * ==========================================================
   */

  function addColor(colorId: number) {
    if (!colorId) return;

    const alreadyExists =
      selectedColors.some(
        (color) =>
          color.color_id === colorId
      );

    if (alreadyExists) return;

    setSelectedColors((current) => [
      ...current,

      {
        color_id: colorId,

        image_url: "",

        file: null,
      },
    ]);
  }

  /**
   * ==========================================================
   * SUPPRIMER UNE COULEUR
   * ==========================================================
   */

  function removeColor(colorId: number) {
    setSelectedColors((current) =>
      current.filter(
        (color) =>
          color.color_id !== colorId
      )
    );

    /**
     * Supprimer également toutes les variantes
     * associées à cette couleur.
     */

    setVariants((current) =>
      current.filter(
        (variant) =>
          variant.color_id !== colorId
      )
    );
  }

  /**
   * ==========================================================
   * IMAGE D'UNE COULEUR
   * ==========================================================
   */

  function updateColorImage(
    colorId: number,
    imageUrl: string,
    file: File | null = null
  ) {
    setSelectedColors((current) =>
      current.map((color) =>
        color.color_id === colorId
          ? {
              ...color,

              image_url: imageUrl,

              file,
            }
          : color
      )
    );
  }

  /**
   * ==========================================================
   * AJOUTER UNE VARIANTE
   * ==========================================================
   */

  function addVariant(
    colorId: number,
    sizeId: number
  ) {
    if (!colorId || !sizeId) return;

    const alreadyExists =
      variants.some(
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

        price:
          Number(form.base_price) || 0,

        old_price:
          form.compare_at_price,

        is_active: true,
      },
    ]);
  }

  /**
   * ==========================================================
   * SUPPRIMER VARIANTE
   * ==========================================================
   */

  function removeVariant(
    colorId: number,
    sizeId: number
  ) {
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

  /**
   * ==========================================================
   * MODIFIER VARIANTE
   * ==========================================================
   */



  function safeNumber(
  value: string,
  fallback: number | null = 0
 ): number | null {
  if (value.trim() === "") {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
 }

  function updateVariant(
    colorId: number,
    sizeId: number,
    field: keyof SelectedVariant,
    value:
      | number
      | boolean
      | null
      | undefined
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

  /**
   * ==========================================================
   * CREATION / MODIFICATION
   * ==========================================================
   */

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError(null);

    /**
     * ========================================================
     * VALIDATIONS
     * ========================================================
     */

    if (!form.name.trim()) {
      setError(
        "Le nom du produit est obligatoire."
      );

      return;
    }

    if (!form.category_id) {
      setError(
        "Veuillez sélectionner une catégorie."
      );

      return;
    }

    if (Number(form.base_price) <= 0) {
      setError(
        "Le prix de base doit être supérieur à 0."
      );

      return;
    }

    /**
     * Vérifier le prix barré.
     */

    if (
      form.compare_at_price !== null &&
      Number(form.compare_at_price) <= 0
    ) {
      setError(
        "Le prix barré doit être supérieur à 0."
      );

      return;
    }

    /**
     * Vérifier le prix d'achat.
     */

    if (
      form.cost_price !== null &&
      Number(form.cost_price) < 0
    ) {
      setError(
        "Le prix d'achat ne peut pas être négatif."
      );

      return;
    }

    /**
     * Vérifier les couleurs.
     */

    if (selectedColors.length === 0) {
      setError(
        "Veuillez sélectionner au moins une couleur."
      );

      return;
    }

    /**
     * Vérifier les variantes.
     */

    if (variants.length === 0) {
      setError(
        "Veuillez ajouter au moins une variante."
      );

      return;
    }

    /**
     * Vérifier les prix des variantes.
     */

    const invalidVariant = variants.find(
      (variant) =>
        Number(variant.price) <= 0
    );

    if (invalidVariant) {
      setError(
        "Chaque variante doit avoir un prix supérieur à 0."
      );

      return;
    }

    /**
     * Vérifier les stocks.
     */

    const invalidStock = variants.find(
      (variant) =>
        Number(variant.stock) < 0
    );

    if (invalidStock) {
      setError(
        "Le stock ne peut pas être négatif."
      );

      return;
    }

    /**
     * ========================================================
     * IMAGES
     * ========================================================
     *
     * Chaque couleur doit avoir une image.
     *
     * Une image peut être :
     *
     * 1. une image existante venant du backend
     * 2. une nouvelle image sélectionnée
     */

    const colorWithoutImage =
      selectedColors.find(
        (color) =>
          !color.file &&
          !color.image_url.trim()
      );

    if (colorWithoutImage) {
      const color = colors.find(
        (item) =>
          item.id ===
          colorWithoutImage.color_id
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
      /**
       * ======================================================
       * UPLOAD DES IMAGES
       * ======================================================
       */

      const colorsPayload: ProductColorPayload[] =
        await Promise.all(
          selectedColors.map(
            async (color) => {
              let imageUrl =
                color.image_url;

              /**
               * Seulement les nouvelles images
               * doivent être uploadées.
               */

              if (color.file) {
                imageUrl =
                  await uploadProductImage(
                    color.file
                  );
              }

              return {
                color_id:
                  color.color_id,

                images: [
                  {
                    url: imageUrl,

                    alt: form.name,

                    position: 0,

                    is_primary: true,
                  },
                ],
              };
            }
          )
        );

      /**
       * ======================================================
       * CONSTRUIRE LES VARIANTES
       * ======================================================
       *
       * On conserve `id` pour les variantes existantes.
       *
       * Exemple :
       *
       * {
       *   id: 15,
       *   color_id: 2,
       *   size_id: 3,
       *   ...
       * }
       *
       * Une nouvelle variante n'a pas d'id.
       */

      const variantsPayload: ProductVariantPayload[] =
        variants.map((variant) => ({
          ...(variant.id
            ? {
                id: variant.id,
              }
            : {}),

          color_id:
            variant.color_id,

          size_id:
            variant.size_id,

          stock:
            Number(variant.stock) || 0,

          price:
            Number(variant.price) || 0,

          old_price:
            variant.old_price !== null
              ? Number(
                  variant.old_price
                )
              : null,

          is_active:
            variant.is_active,
        }));

      /**
       * ======================================================
       * STOCK TOTAL
       * ======================================================
       *
       * Le stock du produit = somme des stocks
       * de toutes les variantes.
       */

      const totalStock =
        variants.reduce(
          (total, variant) =>
            total +
            (Number(variant.stock) || 0),

          0
        );

      /**
       * ======================================================
       * PAYLOAD FINAL
       * ======================================================
       */

      const payload: ProductPayload = {
        name: form.name.trim(),

        description:
          form.description?.trim()
            ? form.description.trim()
            : null,

        base_price:
          Number(form.base_price),

        compare_at_price:
          form.compare_at_price !== null
            ? Number(
                form.compare_at_price
              )
            : null,

        cost_price:
          form.cost_price !== null
            ? Number(form.cost_price)
            : null,

        weight:
          form.weight !== null
            ? Number(form.weight)
            : null,

        gender:
          form.gender || null,

        category_id:
          form.category_id,

        colors:
          colorsPayload,

        variants:
          variantsPayload,

        is_active:
          form.is_active,

        is_featured:
          form.is_featured,

        is_new:
          form.is_new,
      };

      console.log(
        "PRODUCT PAYLOAD:",
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      /**
       * Création ou modification.
       * ProductForm ne fait pas la différence :
       * c'est EditProductPage qui fournit onSubmit.
       */

      await onSubmit(payload);
    } catch (err) {
      console.error(
        "Erreur ProductForm :",
        err
      );

      if (err instanceof ApiError) {
        setError(
          err.message ||
            "Erreur lors de l'enregistrement du produit."
        );
      } else if (
        err instanceof Error
      ) {
        setError(err.message);
      } else {
        setError(
          "Erreur lors de l'enregistrement du produit."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loadingData) {
    return (
      <div className="rounded-lg border p-6">
        Chargement des catégories,
        couleurs et tailles...
      </div>
    );
  }

  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

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
            value={
              form.description ?? ""
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            rows={4}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* PRIX */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* PRIX DE VENTE */}

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
                  base_price:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* PRIX BARRÉ */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Prix barré (DA)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={
                form.compare_at_price ??
                ""
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  compare_at_price:
                    e.target.value
                      ? Number(
                          e.target.value
                        )
                      : null,
                })
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* PRIX D'ACHAT */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Prix d'achat (DA)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={
                form.cost_price ?? ""
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  cost_price:
                    e.target.value
                      ? Number(
                          e.target.value
                        )
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
            value={
              form.weight ?? ""
            }
            onChange={(e) =>
              setForm({
                ...form,

                weight:
                  e.target.value
                    ? Number(
                        e.target.value
                      )
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
            value={
              form.gender ?? ""
            }
            onChange={(e) =>
              setForm({
                ...form,

                gender:
                  e.target.value ||
                  null,
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
            value={
              form.category_id ?? ""
            }
            onChange={(e) =>
              setForm({
                ...form,

                category_id:
                  e.target.value
                    ? Number(
                        e.target.value
                      )
                    : null,
              })
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              — Sélectionner une catégorie —
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
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
            Sélectionnez les couleurs
            disponibles pour ce produit.
          </p>
        </div>

        {/* SELECT COULEUR */}

        <select
          value=""
          onChange={(e) =>
            addColor(
              Number(
                e.target.value
              )
            )
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
                    selected.color_id ===
                    color.id
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

        {/* COULEURS SELECTIONNEES */}

        <div className="space-y-4">
          {selectedColors.map(
            (selectedColor) => {
              const color =
                colors.find(
                  (item) =>
                    item.id ===
                    selectedColor.color_id
                );

              return (
                <div
                  key={
                    selectedColor.color_id
                  }
                  className="rounded-lg border p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">
                      {color?.name ??
                        "Couleur"}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeColor(
                          selectedColor.color_id
                        )
                      }
                      className="text-sm text-red-600 hover:underline"
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
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      if (!file) return;

                      const previewUrl =
                        URL.createObjectURL(
                          file
                        );

                      updateColorImage(
                        selectedColor.color_id,
                        previewUrl,
                        file
                      );
                    }}
                    className="w-full rounded-lg border p-3"
                  />

                  {/* PREVIEW */}

                  {selectedColor.image_url && (
                    <div className="mt-4">
                      <img
                        src={
                          selectedColor.image_url
                        }
                        alt={
                          color?.name ??
                          "Image produit"
                        }
                        className="h-40 w-40 rounded-lg border object-cover"
                      />

                      {selectedColor.file && (
                        <p className="mt-2 text-xs text-neutral-500">
                          Nouvelle image
                          sélectionnée
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
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
            Une variante correspond à
            une combinaison couleur +
            taille.
          </p>
        </div>

        {/* AJOUT VARIANTE */}

        {selectedColors.length >
          0 &&
          sizes.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {selectedColors.map(
                (selectedColor) => {
                  const colorInfo =
                    colors.find(
                      (item) =>
                        item.id ===
                        selectedColor.color_id
                    );

                  return (
                    <div
                      key={
                        selectedColor.color_id
                      }
                      className="rounded-lg border p-4"
                    >
                      <h3 className="mb-3 font-medium">
                        {colorInfo?.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        {sizes.map(
                          (size) => {
                            const exists =
                              variants.some(
                                (variant) =>
                                  variant.color_id ===
                                    selectedColor.color_id &&
                                  variant.size_id ===
                                    size.id
                              );

                            return (
                              <button
                                key={
                                  size.id
                                }
                                type="button"
                                disabled={
                                  exists
                                }
                                onClick={() =>
                                  addVariant(
                                    selectedColor.color_id,
                                    size.id
                                  )
                                }
                                className="rounded-lg border px-3 py-2 text-sm disabled:bg-neutral-100 disabled:text-neutral-400"
                              >
                                {size.name}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

        {/* LISTE VARIANTES */}

        <div className="space-y-3">
          {variants.length ===
            0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-neutral-500">
              Aucune variante
              sélectionnée.
            </div>
          )}

          {variants.map(
            (variant) => {
              const color =
                colors.find(
                  (item) =>
                    item.id ===
                    variant.color_id
                );

              const size =
                sizes.find(
                  (item) =>
                    item.id ===
                    variant.size_id
                );

              return (
                <div
                  key={`${variant.color_id}-${variant.size_id}`}
                  className="rounded-lg border p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {color?.name}{" "}
                        /{" "}
                        {size?.name}
                      </p>

                      {variant.id && (
                        <p className="mt-1 text-xs text-neutral-400">
                          Variante #{variant.id}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          variant.color_id,
                          variant.size_id
                        )
                      }
                      className="text-sm text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {/* STOCK */}

                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Stock
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={Number.isFinite(variant.stock) ? variant.stock : 0}
                        onChange={(e) =>
                          updateVariant(
                            variant.color_id,
                            variant.size_id,
                            "stock",
                            safeNumber(e.target.value, 0) ?? 0
                          )
                        }
                        className="w-full rounded-lg border p-2"
                      />
                    </div>

                    {/* PRIX */}

                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Prix (DA)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={Number.isFinite(variant.price) ? variant.price : 0}
                        onChange={(e) =>
                          updateVariant(
                            variant.color_id,
                            variant.size_id,
                            "price",
                            safeNumber(e.target.value, 0) ?? 0
                          )
                        }
                        className="w-full rounded-lg border p-2"
                      />
                    </div>

                    {/* ANCIEN PRIX */}

                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Ancien prix (DA)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          variant.old_price !== null &&
                          Number.isFinite(variant.old_price)
                             ? variant.old_price
                             : ""
                        }
                        onChange={(e) =>
                          updateVariant(
                            variant.color_id,
                            variant.size_id,
                            "old_price",
                            safeNumber(e.target.value, null)
                          )
                        }
                        className="w-full rounded-lg border p-2"
                      />
                    </div>
                  </div>

                  {/* ACTIVE */}

                  <label className="mt-4 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={
                        variant.is_active
                      }
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
            }
          )}
        </div>
      </div>

      {/* =====================================================
          OPTIONS
      ===================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* ACTIF */}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={
              form.is_active
            }
            onChange={(e) =>
              setForm({
                ...form,

                is_active:
                  e.target.checked,
              })
            }
          />

          Actif
        </label>

        {/* FEATURED */}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={
              form.is_featured
            }
            onChange={(e) =>
              setForm({
                ...form,

                is_featured:
                  e.target.checked,
              })
            }
          />

          Mis en avant
        </label>

        {/* NEW */}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={
              form.is_new
            }
            onChange={(e) =>
              setForm({
                ...form,

                is_new:
                  e.target.checked,
              })
            }
          />

          Nouveau
        </label>
      </div>

      {/* =====================================================
          STOCK TOTAL
      ===================================================== */}

      {variants.length > 0 && (
        <div className="rounded-lg border bg-neutral-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Stock total
            </span>

            <span className="text-lg font-semibold">
              {variants.reduce(
                (total, variant) =>
                  total +
                  (Number(
                    variant.stock
                  ) || 0),
                0
              )}
            </span>
          </div>

          <p className="mt-1 text-xs text-neutral-500">
            Le stock total est calculé
            automatiquement à partir
            des variantes.
          </p>
        </div>
      )}

      {/* =====================================================
          ERREUR
      ===================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =====================================================
          SUBMIT
      ===================================================== */}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Enregistrement..."
          : submitLabel}
      </button>
    </form>
  );
}