"use client";

import { useEffect, useState } from "react";

import { ImageField } from "@/components/ImageField";
import { fetchSettings, saveSettings } from "@/lib/api/site";

type FieldType = "text" | "textarea" | "image";

interface Field {
  key: string;
  label: string;
  type?: FieldType;
  hint?: string;
}

interface Group {
  title: string;
  fields: Field[];
}

const GROUPS: Group[] = [
  {
    title: "Marque & contact",
    fields: [
      { key: "brand_name", label: "Nom de la marque" },
      { key: "site_description", label: "Description du site (SEO)", type: "textarea" },
      { key: "contact_email", label: "Email de contact" },
      { key: "contact_phone", label: "Téléphone" },
      { key: "contact_address", label: "Adresse" },
      { key: "instagram_url", label: "Lien Instagram" },
      { key: "facebook_url", label: "Lien Facebook" },
      { key: "tiktok_url", label: "Lien TikTok" },
      { key: "footer_copyright", label: "Copyright du footer", hint: "{year} = année en cours" },
    ],
  },
  {
    title: "Accueil — bandeau principal",
    fields: [
      { key: "hero_eyebrow", label: "Sur-titre (ex. saison)" },
      { key: "hero_title", label: "Titre", type: "textarea", hint: "Une ligne par retour à la ligne" },
      { key: "hero_subtitle", label: "Sous-titre", type: "textarea" },
      { key: "hero_cta_label", label: "Bouton 1 — texte" },
      { key: "hero_cta_link", label: "Bouton 1 — lien" },
      { key: "hero_cta2_label", label: "Bouton 2 — texte" },
      { key: "hero_cta2_link", label: "Bouton 2 — lien" },
      { key: "hero_caption", label: "Légende sous le visuel" },
    ],
  },
  {
    title: "Accueil — sections",
    fields: [
      { key: "best_sellers_title", label: "Meilleures ventes — titre" },
      { key: "best_sellers_subtitle", label: "Meilleures ventes — sous-titre" },
      { key: "why_eyebrow", label: "Pourquoi nous — sur-titre" },
      { key: "why_title", label: "Pourquoi nous — titre" },
      { key: "why_subtitle", label: "Pourquoi nous — sous-titre", type: "textarea" },
      { key: "testimonials_title", label: "Témoignages — titre" },
      { key: "testimonials_subtitle", label: "Témoignages — sous-titre" },
      { key: "story_eyebrow", label: "Notre histoire — sur-titre" },
      { key: "story_title", label: "Notre histoire — titre" },
      { key: "story_text", label: "Notre histoire — texte", type: "textarea" },
      { key: "story_cta_label", label: "Notre histoire — bouton" },
      { key: "story_image", label: "Notre histoire — image", type: "image" },
      { key: "instagram_title", label: "Instagram — titre" },
    ],
  },
  {
    title: "Page À propos",
    fields: [
      { key: "about_eyebrow", label: "Sur-titre" },
      { key: "about_title", label: "Titre" },
      { key: "about_text", label: "Texte", type: "textarea", hint: "Séparez les paragraphes par une ligne vide" },
      { key: "about_image", label: "Image", type: "image" },
      { key: "about_image_alt", label: "Description de l'image" },
      { key: "about_cta_label", label: "Bouton" },
    ],
  },
  {
    title: "Contact, FAQ & newsletter",
    fields: [
      { key: "contact_title", label: "Contact — titre" },
      { key: "contact_subtitle", label: "Contact — sous-titre" },
      { key: "contact_success", label: "Contact — message de confirmation" },
      { key: "faq_title", label: "FAQ — titre" },
      { key: "newsletter_title", label: "Newsletter — titre" },
      { key: "newsletter_text", label: "Newsletter — texte", type: "textarea" },
    ],
  },
  {
    title: "Fiche produit",
    fields: [
      { key: "shipping_info", label: "Texte livraison", type: "textarea" },
      { key: "returns_info", label: "Texte retours", type: "textarea" },
    ],
  },
];

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchSettings()
      .then(setValues)
      .catch(() => setMessage({ ok: false, text: "Impossible de charger les paramètres." }))
      .finally(() => setLoading(false));
  }, []);

  function set(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);
      setValues(await saveSettings(values));
      setMessage({ ok: true, text: "Paramètres enregistrés." });
    } catch {
      setMessage({ ok: false, text: "Impossible d'enregistrer les paramètres." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f1] px-8 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-[#111]">Paramètres du site</h1>
            <p className="mt-2 text-sm text-gray-500">
              Tous les textes et images affichés sur la boutique.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              message.ok
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Chargement...</p>
        ) : (
          <div className="space-y-8">
            {GROUPS.map((group) => (
              <section
                key={group.title}
                className="rounded-xl border border-[#dedbd5] bg-white p-6 shadow-sm"
              >
                <h2 className="mb-6 font-serif text-2xl text-[#111]">{group.title}</h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {group.fields.map((field) => {
                    const wide = field.type === "textarea" || field.type === "image";
                    return (
                      <div key={field.key} className={wide ? "md:col-span-2" : ""}>
                        {field.type === "image" ? (
                          <ImageField
                            label={field.label}
                            value={values[field.key] ?? ""}
                            onChange={(v) => set(field.key, v)}
                          />
                        ) : (
                          <>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                rows={4}
                                value={values[field.key] ?? ""}
                                onChange={(e) => set(field.key, e.target.value)}
                                className={input}
                              />
                            ) : (
                              <input
                                type="text"
                                value={values[field.key] ?? ""}
                                onChange={(e) => set(field.key, e.target.value)}
                                className={input}
                              />
                            )}
                            {field.hint && (
                              <p className="mt-1 text-xs text-gray-400">{field.hint}</p>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
