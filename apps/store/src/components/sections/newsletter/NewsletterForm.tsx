"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "../../ui/button";
import { subscribeNewsletter } from "../../../lib/api/site";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      await subscribeNewsletter(email);
      setEmail("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-12">
      <div className="flex flex-col gap-4 md:flex-row">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
          className="h-14 flex-1 rounded-full border border-neutral-700 bg-transparent px-6 outline-none transition focus:border-[#C8A96A]"
        />

        <Button
          variant="luxury"
          size="lg"
          type="submit"
          disabled={status === "loading"}
        >
          Subscribe
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {status === "done" && (
        <p role="status" className="mt-4 text-sm text-[#C8A96A]">
          ✓
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          Subscription failed. This email may already be registered.
        </p>
      )}
    </form>
  );
}
