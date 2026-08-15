"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  is_admin: boolean;
}

interface AuthStore {
  token: string | null;
  user: AdminUser | null;
  setSession: (token: string, user: AdminUser) => void;
  logout: () => void;
}

export const useAdminAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "portovero-admin-auth" }
  )
);