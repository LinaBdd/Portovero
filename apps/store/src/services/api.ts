import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Add JWT token to every request
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Handle API errors
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("token");

      window.location.href = "/account/login";
    }

    return Promise.reject(error);
  }
);

export default api;