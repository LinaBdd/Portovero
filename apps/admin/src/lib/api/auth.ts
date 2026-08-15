import { apiClient } from "./client";

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUserResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  is_admin: boolean;
  is_registered: boolean;
  is_active: boolean;
}

export function login(data: LoginPayload) {
  return apiClient<TokenResponse>("/auth/login", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function getMe(token: string) {
  return apiClient<AdminUserResponse>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    auth: false,
  });
}