"use client";

import { useState } from "react";

import { sendContactMessage } from "../../lib/api/site";

const field =
  "w-full border border-[#dedbd3] bg-[#fbfaf7] px-4 py-3 text-sm outline-none transition placeholder:text-[#96938a] focus:border-[#0F2D52]";

export function ContactForm({ successMessage }: { successMessage: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");

    try {
      await sendContactMessage({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p
        role="status"
        className="h-fit border border-[#dedbd3] bg-[#edf2eb] p-6 text-sm text-[#52634f]"
      >
        {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="sr-only">Name</span>
        <input required name="name" placeholder="Name" className={field} />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          className={field}
        />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Message"
          className={field}
        />
      </label>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          Your message could not be sent. Please try again.
        </p>
      )}

      <button
        disabled={status === "sending"}
        className="w-full bg-[#0F2D52] py-3.5 text-xs tracking-[0.2em] text-white transition hover:bg-[#0c2444] disabled:opacity-60"
      >
        Send message
      </button>
    </form>
  );
}
