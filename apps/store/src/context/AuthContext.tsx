"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as auth from "../services/auth";

interface AuthContextType {
  user: auth.User | null;
  loading: boolean;

  login: (
    phone: string,
    password: string
  ) => Promise<void>;

  logout: () => void;

  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] =
    useState<auth.User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {

      const me = await auth.me();

      setUser(me);

    } catch {

      localStorage.removeItem("token");

      setUser(null);

    } finally {

      setLoading(false);

    }

  };

  const login = async (
    phone: string,
    password: string
  ) => {

    setLoading(true);

    try {

      const data = await auth.login({
        phone,
        password,
      });

      localStorage.setItem(
        "token",
        data.access_token
      );

      await refreshUser();

    } finally {

      setLoading(false);

    }

  };

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

  };

  useEffect(() => {

    refreshUser();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);