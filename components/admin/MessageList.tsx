"use client";

import { useRouter } from "next/navigation";
import type { ContactMessage } from "@/lib/types";

export function MessageList({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  if (!messages.length) return <p className="text-stone">Aucun message.</p>;
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <article key={message.id} className="bg-white p-4">
          <p className="font-serif text-2xl">{message.name}</p>
          <p className="text-sm text-stone">{message.phone} {message.email}</p>
          <p className="mt-3">{message.message}</p>
          <button
            type="button"
            className="mt-3 text-sm"
            onClick={async () => {
              await fetch(`/api/contact/${message.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: !message.read }),
              });
              router.refresh();
            }}
          >
            {message.read ? "Marquer non lu" : "Marquer lu"}
          </button>
        </article>
      ))}
    </div>
  );
}
