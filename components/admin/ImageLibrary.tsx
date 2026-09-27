"use client";

import { useState } from "react";

export function ImageLibrary({ urls }: { urls: string[] }) {
  const [list, setList] = useState(urls);
  const [copied, setCopied] = useState("");

  async function upload(file: File) {
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    const data = (await response.json()) as { url?: string };
    if (data.url) setList((current) => [data.url!, ...current]);
  }

  return (
    <div>
      <label className="inline-block cursor-pointer rounded-md bg-ink px-4 py-2 text-sm text-white">
        Importer une image
        <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
      </label>
      {copied ? <p className="mt-3 text-sm">Copié : {copied}</p> : null}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {list.map((url) => (
          <button
            key={url}
            type="button"
            className="bg-white p-2 text-left"
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              setCopied(url);
            }}
          >
            <img src={url} alt="" className="aspect-square w-full object-cover" />
            <span className="mt-2 block truncate text-xs text-stone">{url}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
