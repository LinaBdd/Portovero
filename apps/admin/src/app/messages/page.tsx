"use client";

import { useEffect, useState } from "react";

import {
  deleteMessage,
  fetchMessages,
  fetchSubscribers,
  markMessage,
  type ContactMessage,
  type Subscriber,
} from "@/lib/api/site";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessagesPage() {
  const [tab, setTab] = useState<"messages" | "newsletter">("messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [m, s] = await Promise.all([fetchMessages(), fetchSubscribers()]);
      setMessages(m);
      setSubscribers(s);
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(message: ContactMessage) {
    try {
      await markMessage(message.id, !message.is_read);
      await load();
    } catch {
      setError("Impossible de mettre à jour le message.");
    }
  }

  async function remove(message: ContactMessage) {
    if (!window.confirm(`Supprimer le message de ${message.name} ?`)) return;
    try {
      await deleteMessage(message.id);
      await load();
    } catch {
      setError("Impossible de supprimer le message.");
    }
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <main className="min-h-screen bg-[#f7f5f1] px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#111]">Messages</h1>
          <p className="mt-2 text-sm text-gray-500">
            Formulaire de contact et inscriptions à la newsletter.
          </p>
        </div>

        <div className="mb-6 flex gap-2">
          {(
            [
              ["messages", `Contact${unread ? ` (${unread} non lus)` : ""}`],
              ["newsletter", `Newsletter (${subscribers.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                tab === id
                  ? "border-[#171717] bg-[#171717] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-[#dedbd5] bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">Chargement...</div>
          ) : tab === "messages" ? (
            messages.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">Aucun message.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {messages.map((message) => (
                  <li key={message.id} className="px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {!message.is_read && (
                            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#B89B5E]" />
                          )}
                          {message.name}{" "}
                          <a
                            href={`mailto:${message.email}`}
                            className="font-normal text-gray-500 hover:underline"
                          >
                            &lt;{message.email}&gt;
                          </a>
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(message.created_at)}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleRead(message)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          {message.is_read ? "Marquer non lu" : "Marquer lu"}
                        </button>
                        <button
                          onClick={() => remove(message)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                      {message.message}
                    </p>
                  </li>
                ))}
              </ul>
            )
          ) : subscribers.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">Aucun abonné.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-[#faf9f7] text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email / téléphone
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Inscrit le
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subscriber.email ?? subscriber.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(subscriber.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
