"use client";

import { useEffect, useState } from "react";
import { fetchCategories, createCategory, deleteCategory, ApiCategory } from "../../lib/api/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function load() {
    fetchCategories().then((res) => setCategories(res.items)).catch(console.error);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createCategory({ name });
      setName("");
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    await deleteCategory(id);
    load();
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">Catégories</h1>

      <form onSubmit={handleCreate} className="mb-8 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la catégorie"
          className="flex-1 rounded-lg border p-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-neutral-900 px-6 py-3 text-sm text-white disabled:opacity-50"
        >
          Ajouter
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-lg border bg-white p-4"
          >
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-neutral-500">{cat.slug}</p>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}