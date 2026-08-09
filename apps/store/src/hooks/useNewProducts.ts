"use client";

import { useEffect, useState } from "react";
import { getNewProducts } from "../services/product";

export function useNewProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getNewProducts();

        setProducts(data);
      } catch (err) {
        console.error("Failed to load new products:", err);
        setError("Unable to load new products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
  };
}