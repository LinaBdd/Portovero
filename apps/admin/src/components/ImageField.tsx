"use client";

import { useState } from "react";

import { mediaUrl, uploadImage } from "@/lib/api/site";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Champ image : upload vers le backend, ou chemin/URL saisi à la main. */
export function ImageField({ label, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      onChange(await uploadImage(file));
    } catch {
      setError("Échec de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-start gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(value)}
            alt=""
            className="h-24 w-24 shrink-0 rounded-lg border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
            Aucune
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#171717] file:px-4 file:py-2 file:text-sm file:text-white"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ou /chemin ou https://…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
          />
          {uploading && <p className="text-xs text-gray-500">Envoi…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-red-600 hover:underline"
            >
              Retirer l&apos;image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
