"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../../services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await register(form);

      router.push("/account/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ??
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-lg rounded-xl border bg-white p-8 shadow">

      <h1 className="mb-8 text-center text-3xl font-bold">
        Create Account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label>First Name</label>

          <input
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            className="mt-1 w-full rounded border p-3"
            required
          />
        </div>

        <div>
          <label>Last Name</label>

          <input
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            className="mt-1 w-full rounded border p-3"
            required
          />
        </div>

        <div>
          <label>Phone</label>

          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded border p-3"
            required
          />
        </div>

        <div>
          <label>Email</label>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded border p-3"
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded border p-3"
            required
          />
        </div>

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black py-3 text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading
            ? "Creating account..."
            : "Create Account"}
        </button>

      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <a
          href="/account/login"
          className="font-semibold underline"
        >
          Login
        </a>
      </p>

    </div>
  );
}