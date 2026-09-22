import { API_URL as BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiClientOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(
      "portovero-admin-auth"
    );

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("portovero-admin-auth");

  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

function handleUnauthorized(status: number) {
  if (status === 401) {
    clearAdminSession();
  }
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const {
    body,
    headers,
    auth = true,
    ...rest
  } = options;

  const token = auth
    ? getStoredToken()
    : null;

  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...rest,

      headers: {
        Accept: "application/json",

        ...(body !== undefined
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...headers,
      },

      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,

      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res
        .text()
        .catch(() => "");

      handleUnauthorized(res.status);

      throw new ApiError(
        res.status,
        text || res.statusText
      );
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error(
      "❌ API REQUEST FAILED:",
      url,
      error
    );

    throw error;
  }
}

/**
 * Upload d'un fichier avec authentification admin.
 */
export async function uploadFile<T>(
  path: string,
  file: File,
  fieldName = "file"
): Promise<T> {
  const token = getStoredToken();

  const formData = new FormData();

  formData.append(fieldName, file);

  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method: "POST",

    headers: {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },

    body: formData,

    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res
      .text()
      .catch(() => "");

    handleUnauthorized(res.status);

    throw new ApiError(
      res.status,
      text || `Upload failed (${res.status})`
    );
  }

  return (await res.json()) as T;
}