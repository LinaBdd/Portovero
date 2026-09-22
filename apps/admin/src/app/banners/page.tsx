"use client";

import { useEffect, useState } from "react";

import { ImageField } from "@/components/ImageField";
import {
  createBanner,
  deleteBanner,
  fetchBanners,
  mediaUrl,
  updateBanner,
  type Banner,
  type BannerPayload,
} from "@/lib/api/site";

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

function empty(position: number): BannerPayload {
  return {
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    button_text: "",
    button_link: "",
    position,
    is_active: true,
  };
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BannerPayload | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setBanners(await fetchBanners());
    } catch {
      setError("Impossible de charger les bannières.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function patch(values: Partial<BannerPayload>) {
    setForm((current) => (current ? { ...current, ...values } : current));
  }

  function openEdit(banner: Banner) {
    const { id, ...rest } = banner;
    setEditingId(id);
    setForm({
      ...rest,
      subtitle: rest.subtitle ?? "",
      description: rest.description ?? "",
      button_text: rest.button_text ?? "",
      button_link: rest.button_link ?? "",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    if (!form.title.trim() || !form.image_url.trim()) {
      setError("Le titre et l'image sont obligatoires.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateBanner(editingId, form);
      } else {
        await createBanner(form);
      }
      setForm(null);
      setEditingId(null);
      await load();
    } catch {
      setError("Impossible d'enregistrer la bannière.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(banner: Banner) {
    if (!window.confirm(`Supprimer la bannière « ${banner.title} » ?`)) return;
    try {
      setError(null);
      await deleteBanner(banner.id);
      await load();
    } catch {
      setError("Impossible de supprimer la bannière.");
    }
  }

  async function toggleActive(banner: Banner) {
    try {
      await updateBanner(banner.id, { is_active: !banner.is_active });
      await load();
    } catch {
      setError("Impossible de modifier la visibilité.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f1] px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-[#111]">Bannières</h1>
            <p className="mt-2 text-sm text-gray-500">
              La première bannière active remplace les vignettes de catégories dans le bandeau
              d&apos;accueil.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm(empty(banners.length + 1));
            }}
            className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            + Ajouter une bannière
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {form && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 grid gap-5 rounded-xl border border-[#dedbd5] bg-white p-6 shadow-sm md:grid-cols-2"
          >
            <h2 className="font-serif text-2xl text-[#111] md:col-span-2">
              {editingId ? "Modifier la bannière" : "Nouvelle bannière"}
            </h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Titre</label>
              <input
                className={input}
                value={form.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Sur-titre</label>
              <input
                className={input}
                value={form.subtitle ?? ""}
                onChange={(e) => patch({ subtitle: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                className={input}
                value={form.description ?? ""}
                onChange={(e) => patch({ description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <ImageField
                label="Image"
                value={form.image_url}
                onChange={(v) => patch({ image_url: v })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Bouton — texte</label>
              <input
                className={input}
                value={form.button_text ?? ""}
                onChange={(e) => patch({ button_text: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Bouton — lien</label>
              <input
                className={input}
                placeholder="/shop"
                value={form.button_link ?? ""}
                onChange={(e) => patch({ button_link: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Position</label>
              <input
                type="number"
                className={input}
                value={form.position}
                onChange={(e) => patch({ position: Number(e.target.value) })}
              />
            </div>
            <label className="flex items-center gap-3 self-end pb-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => patch({ is_active: e.target.checked })}
              />
              Active
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(null);
                  setEditingId(null);
                }}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-xl border border-[#dedbd5] bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">Chargement...</div>
          ) : banners.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">Aucune bannière.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {banners.map((banner) => (
                <li key={banner.id} className="flex items-center gap-4 px-6 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(banner.image_url)}
                    alt=""
                    className="h-16 w-24 shrink-0 rounded-md border border-gray-200 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{banner.title}</p>
                    <p className="truncate text-xs text-gray-500">
                      Position {banner.position}
                      {banner.button_link ? ` · ${banner.button_link}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      banner.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {banner.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => openEdit(banner)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
