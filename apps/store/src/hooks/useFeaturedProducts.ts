"use client";

import { useEffect, useState } from "react";

import { getFeaturedProducts } from "../services/product";

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getFeaturedProducts();
        setProducts(data);
      } catch {
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    products,
    loading,
    error,
  };
}