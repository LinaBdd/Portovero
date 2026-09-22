/**
 * Configuration d'environnement de l'admin — point d'entrée unique.
 *
 * `NEXT_PUBLIC_API_URL` est défini par environnement (dev/staging/prod)
 * dans les fichiers `.env.*` (voir `.env.example`). Ne jamais relire
 * `process.env.NEXT_PUBLIC_API_URL` ailleurs dans le code : importer
 * `API_URL` depuis ce fichier.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
