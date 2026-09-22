"use client";

import { useCallback, useEffect, useState } from "react";

import { ImageField } from "@/components/ImageField";
import {
  createContent,
  deleteContent,
  fetchContent,
  updateContent,
  type ContentItem,
  type ContentPayload,
  type ContentType,
} from "@/lib/api/site";

const ICONS = [
  "ShieldCheck",
  "Truck",
  "Sparkles",
  "BadgeCheck",
  "Heart",
  "Star",
  "Package",
  "Leaf",
  "Gem",
];

interface TypeConfig {
  type: ContentType;
  label: string;
  singular: string;
  titleLabel: string;
  subtitleLabel?: string;
  textLabel?: string;
  image?: boolean;
  link?: boolean;
  icon?: boolean;
  rating?: boolean;
}

const TYPES: TypeConfig[] = [
  { type: "faq", label: "FAQ", singular: "question", titleLabel: "Question", textLabel: "Réponse" },
  {
    type: "testimonial",
    label: "Témoignages",
    singular: "témoignage",
    titleLabel: "Nom du client",
    subtitleLabel: "Ville",
    textLabel: "Avis",
    rating: true,
  },
  {
    type: "feature",
    label: "Pourquoi nous",
    singular: "argument",
    titleLabel: "Titre",
    textLabel: "Description",
    icon: true,
  },
  { type: "value", label: "Valeurs (À propos)", singular: "valeur", titleLabel: "Titre", textLabel: "Texte" },
  { type: "instagram", label: "Instagram", singular: "image", titleLabel: "Légende (interne)", image: true, link: true },
];

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

function emptyPayload(type: ContentType, position: number): ContentPayload {
  return {
    type,
    title: "",
    subtitle: "",
    text: "",
    image: "",
    link: "",
    icon: type === "feature" ? ICONS[0] : "",
    rating: type === "testimonial" ? 5 : null,
    position,
    is_active: true,
  };
}

export default function ContentPage() {
  const [config, setConfig] = useState<TypeConfig>(TYPES[0]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ContentPayload | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (type: ContentType) => {
    try {
      setLoading(true);
      setError(null);
      setItems(await fetchContent(type));
    } catch {
      setError("Impossible de charger le contenu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(config.type);
    setForm(null);
    setEditingId(null);
  }, [config, load]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyPayload(config.type, items.length));
  }

  function openEdit(item: ContentItem) {
    const { id, ...rest } = item;
    setEditingId(id);
    setForm({
      ...rest,
      subtitle: rest.subtitle ?? "",
      text: rest.text ?? "",
      image: rest.image ?? "",
      link: rest.link ?? "",
      icon: rest.icon ?? "",
    });
  }

  function patch(values: Partial<ContentPayload>) {
    setForm((current) => (current ? { ...current, ...values } : current));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    if (!form.title.trim()) {
      setError(`Le champ « ${config.titleLabel} » est obligatoire.`);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateContent(editingId, form);
      } else {
        await createContent(form);
      }
      setForm(null);
      setEditingId(null);
      await load(config.type);
    } catch {
      setError("Impossible d'enregistrer.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: ContentItem) {
    if (!window.confirm(`Supprimer « ${item.title || "cet élément"} » ?`)) return;
    try {
      setError(null);
      await deleteContent(item.id);
      await load(config.type);
    } catch {
      setError("Impossible de supprimer.");
    }
  }

  async function toggleActive(item: ContentItem) {
    try {
      await updateContent(item.id, { is_active: !item.is_active });
      await load(config.type);
    } catch {
      setError("Impossible de modifier la visibilité.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f1] px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-[#111]">Contenu</h1>
            <p className="mt-2 text-sm text-gray-500">
              FAQ, témoignages, arguments, valeurs et images Instagram.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            + Ajouter
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => setConfig(t)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                t.type === config.type
                  ? "border-[#171717] bg-[#171717] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
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
              {editingId ? "Modifier" : "Ajouter"} — {config.singular}
            </h2>

            <div className={config.subtitleLabel ? "" : "md:col-span-2"}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {config.titleLabel}
              </label>
              <input
                className={input}
                value={form.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </div>

            {config.subtitleLabel && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {config.subtitleLabel}
                </label>
                <input
                  className={input}
                  value={form.subtitle ?? ""}
                  onChange={(e) => patch({ subtitle: e.target.value })}
                />
              </div>
            )}

            {config.textLabel && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {config.textLabel}
                </label>
                <textarea
                  rows={4}
                  className={input}
                  value={form.text ?? ""}
                  onChange={(e) => patch({ text: e.target.value })}
                />
              </div>
            )}

            {config.icon && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Icône</label>
                <select
                  className={input}
                  value={form.icon ?? ""}
                  onChange={(e) => patch({ icon: e.target.value })}
                >
                  {ICONS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {config.rating && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Note</label>
                <select
                  className={input}
                  value={form.rating ?? 5}
                  onChange={(e) => patch({ rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </div>
            )}

            {config.image && (
              <div className="md:col-span-2">
                <ImageField
                  label="Image"
                  value={form.image ?? ""}
                  onChange={(v) => patch({ image: v })}
                />
              </div>
            )}

            {config.link && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Lien (optionnel)
                </label>
                <input
                  className={input}
                  value={form.link ?? ""}
                  onChange={(e) => patch({ link: e.target.value })}
                />
              </div>
            )}

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
              Visible sur le site
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
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Aucun élément. Cliquez sur « Ajouter ».
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <span className="w-8 shrink-0 text-xs text-gray-400">#{item.position}</span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.title || "(sans titre)"}
                    </p>
                    {(item.text || item.subtitle) && (
                      <p className="truncate text-xs text-gray-500">
                        {item.subtitle ? `${item.subtitle} — ` : ""}
                        {item.text}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => toggleActive(item)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.is_active ? "Visible" : "Masqué"}
                  </button>

                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
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
