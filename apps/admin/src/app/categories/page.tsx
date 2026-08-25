"use client";

import { useEffect, useRef, useState } from "react";

import {
  fetchCategories,
  createCategory,
  deleteCategory,
  ApiCategory,
} from "../../lib/api/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);


  const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

 function getImageUrl(path?: string | null) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
 } 
  async function load() {
    try {
      setLoadingCategories(true);
      setError(null);

      const res = await fetchCategories();
      setCategories(res.items);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les catégories.");
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Vérification du type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    // Limite 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 MB.");
      return;
    }

    setError(null);

    setImageFile(file);

    // Supprimer l'ancien preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const raw = localStorage.getItem("portovero-admin-auth");

  if (!raw) {
    throw new Error("Session administrateur introuvable.");
  }

  const parsed = JSON.parse(raw);
  const token = parsed?.state?.token;

  if (!token) {
    throw new Error("Token administrateur introuvable.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/admin/upload/image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");

    throw new Error(
      text || `Échec de l'upload de l'image (${response.status})`
    );
  }

  const data = await response.json();

  return data.url;
}

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl: string | undefined = undefined;

      /*
       * 1. Upload de l'image
       */
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      /*
       * 2. Création de la catégorie
       */
      await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
        image: imageUrl,
      });

      /*
       * 3. Reset
       */
      setName("");
      setDescription("");
      removeImage();

      /*
       * 4. Reload depuis le backend
       */
      await load();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de créer la catégorie."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette catégorie ?"
    );

    if (!confirmed) return;

    try {
      setError(null);

      await deleteCategory(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer cette catégorie.");
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Catégories
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Gérez les catégories de votre boutique et leurs visuels.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError(null)}
            className="font-medium hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* CREATE */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-neutral-900">
            Ajouter une catégorie
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Créez une nouvelle catégorie pour organiser vos produits.
          </p>
        </div>

        <form onSubmit={handleCreate} className="p-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* FORM */}
            <div className="space-y-6">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Nom de la catégorie
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Chemises"
                  className="
                    w-full rounded-xl border border-neutral-200
                    px-4 py-3 text-sm outline-none
                    transition
                    placeholder:text-neutral-400
                    focus:border-neutral-900
                    focus:ring-2 focus:ring-neutral-900/10
                  "
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Description
                  <span className="ml-1 font-normal text-neutral-400">
                    (optionnel)
                  </span>
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de la catégorie..."
                  rows={4}
                  className="
                    w-full resize-none rounded-xl
                    border border-neutral-200
                    px-4 py-3 text-sm outline-none
                    transition
                    placeholder:text-neutral-400
                    focus:border-neutral-900
                    focus:ring-2 focus:ring-neutral-900/10
                  "
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Image de la catégorie
                </label>

                <div
                  className="
                    rounded-2xl border-2 border-dashed
                    border-neutral-200 bg-neutral-50
                    p-6 text-center transition
                    hover:border-neutral-400
                  "
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleImageChange}
                    className="hidden"
                    id="category-image"
                  />

                  {!imageFile ? (
                    <label
                      htmlFor="category-image"
                      className="flex cursor-pointer flex-col items-center"
                    >
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M12 3v12" />
                          <path d="m7 8 5-5 5 5" />
                          <path d="M5 21h14" />
                        </svg>
                      </div>

                      <span className="text-sm font-medium text-neutral-800">
                        Choisir une image
                      </span>

                      <span className="mt-1 text-xs text-neutral-400">
                        PNG, JPG, WEBP ou AVIF — max. 5 MB
                      </span>
                    </label>
                  ) : (
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="text-left">
                          <p className="text-sm font-medium text-neutral-800">
                            Image sélectionnée
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-neutral-400">
                            {imageFile.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={removeImage}
                          className="
                            rounded-lg px-3 py-2
                            text-xs font-medium
                            text-red-600
                            hover:bg-red-50
                          "
                        >
                          Supprimer
                        </button>
                      </div>

                      <label
                        htmlFor="category-image"
                        className="
                          inline-flex cursor-pointer
                          rounded-lg border border-neutral-200
                          bg-white px-4 py-2
                          text-xs font-medium
                          text-neutral-700
                          hover:bg-neutral-50
                        "
                      >
                        Changer l'image
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    rounded-xl bg-neutral-900
                    px-6 py-3
                    text-sm font-medium text-white
                    transition
                    hover:bg-neutral-800
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading
                    ? imageFile
                      ? "Upload et création..."
                      : "Création..."
                    : "Ajouter la catégorie"}
                </button>
              </div>
            </div>

            {/* PREVIEW */}
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-800">
                Aperçu
              </p>

              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                {imagePreview ? (
                  <div className="relative aspect-[4/3]">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">
                      {name || "Nouvelle catégorie"}
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="category-image"
                    className="
                      flex aspect-[4/3] cursor-pointer
                      items-center justify-center
                    "
                  >
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-neutral-400"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>

                      <p className="text-sm text-neutral-500">
                        Aucune image sélectionnée
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        Cliquez pour parcourir
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* CATEGORIES */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Vos catégories
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {categories.length} catégorie
              {categories.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loadingCategories ? (
          <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200"
              >
                <div className="aspect-[4/3] bg-neutral-100" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/2 rounded bg-neutral-100" />
                  <div className="h-3 w-3/4 rounded bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-medium text-neutral-900">
              Aucune catégorie
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Commencez par créer votre première catégorie.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="
                  group overflow-hidden rounded-2xl
                  border border-neutral-200 bg-white
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  {cat.image ? (
                    <img
                      src={getImageUrl(cat.image) ?? ""}
                      alt={cat.name}
                      className="
                        h-full w-full object-cover
                        transition duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-neutral-400">
                        Aucune image
                      </span>
                    </div>
                  )}

                  <div className="absolute right-3 top-3">
                    <span
                      className={`
                        rounded-full px-3 py-1
                        text-xs font-medium
                        backdrop-blur-md
                        ${
                          cat.is_active
                            ? "bg-white/90 text-green-700"
                            : "bg-white/90 text-neutral-500"
                        }
                      `}
                    >
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-900">
                        {cat.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-neutral-400">
                        /{cat.slug}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-lg bg-neutral-100 px-2 py-1 text-xs text-neutral-500">
                      #{cat.id}
                    </span>
                  </div>

                  {cat.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-5 text-neutral-500">
                      {cat.description}
                    </p>
                  )}

                  <div className="mt-5 flex justify-end border-t border-neutral-100 pt-4">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="
                        rounded-lg px-3 py-2
                        text-xs font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}