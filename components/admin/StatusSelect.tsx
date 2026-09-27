"use client";

import { useRouter } from "next/navigation";

export function StatusSelect({
  id,
  status,
  endpoint,
  options,
}: {
  id: string;
  status: string;
  endpoint: string;
  options: string[];
}) {
  const router = useRouter();
  return (
    <select
      value={status}
      onChange={async (event) => {
        await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: event.target.value, id }),
        });
        router.refresh();
      }}
      className="border border-black/10 bg-white px-2 py-1 text-sm"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
