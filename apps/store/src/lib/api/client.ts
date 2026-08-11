import { useAuth } from "../../store/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

  const token = auth ? getStoredToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || res.statusText);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}