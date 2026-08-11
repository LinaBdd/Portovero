import { apiClient } from "./client";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  password: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
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

export function register(data: RegisterPayload) {
  return apiClient<UserResponse>("/auth/register", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function login(data: LoginPayload) {
  return apiClient<TokenResponse>("/auth/login", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function getMe(token: string) {
  return apiClient<UserResponse>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    auth: false, // on passe le token explicitement ici (juste après login, avant qu'il soit dans le store)
  });
}