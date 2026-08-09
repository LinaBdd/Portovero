import api from "./api";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  is_admin: boolean;
}

export const login = async (data: {
  phone: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const register = async (data: any) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

export const me = async (): Promise<User> => {
  const response = await api.get("/auth/me");

  return response.data;
};