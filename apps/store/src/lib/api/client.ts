import { useAuth } from "../../store/auth";
import { API_URL as BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

function getStoredToken(): string | null {
  // Le store Zustand (auth.ts) est "use client" — inaccessible pendant le rendu serveur.
  // On lit directement le localStorage, qui n'existe que côté navigateur.
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("portovero-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  path: string,
  options?: ApiClientOptions
): Promise<T> {
  const { body, headers, auth = true, ...rest } = options ?? {};

  // ✅ Normalise le path (évite les doubles slash)
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const token = auth ? getStoredToken() : null;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${normalizedPath}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    // ✅ Erreur réseau (backend down, CORS, DNS…)
    throw new ApiError(0, "Network error — is the API running?");
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const json = await res.json();
      message = json?.detail ?? json?.message ?? message;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}