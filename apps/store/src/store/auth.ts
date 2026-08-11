"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  is_admin: boolean;
  is_registered: boolean;
  is_active: boolean;
}

interface AuthStore {
  token: string | null;
  user: User | null;

  setSession: (token: string, user: User) => void;
  logout: () => void;

  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setSession: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "portovero-auth",
    }
  )
);