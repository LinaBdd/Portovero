/**
 * Configuration d'environnement du store — point d'entrée unique.
 *
 * `NEXT_PUBLIC_API_URL` est défini par app (dev/staging/prod) dans les
 * fichiers `.env.*` (voir `.env.example`). Ne jamais relire
 * `process.env.NEXT_PUBLIC_API_URL` ailleurs dans le code : importer
 * `API_URL` depuis ce fichier.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const PLACEHOLDER_IMAGE = "/images/products/placeholder.webp";
