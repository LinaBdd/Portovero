import { apiClient } from "@/lib/api/client";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  marketing_consent: boolean;
  is_registered: boolean;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  total: number;
  items: User[];
}

export async function fetchUsers(params?: {
  skip?: number;
  limit?: number;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.skip !== undefined) {
    searchParams.set("skip", String(params.skip));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const query = searchParams.toString();

  return apiClient<UserListResponse>(
    `/admin/users${query ? `?${query}` : ""}`,
    {
      auth: true,
    }
  );
}

export async function fetchUser(userId: number) {
  return apiClient<User>(
    `/admin/users/${userId}`,
    {
      auth: true,
    }
  );
}