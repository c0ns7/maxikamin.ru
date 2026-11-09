"use client";

import { useState } from "react";

export default function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="cursor-pointer rounded-md border border-[#ddd6cb] bg-white px-3 py-1.5 text-xs font-medium text-[#1a1714] transition hover:border-[#a84f32] hover:text-[#a84f32]"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          // fallback
          const input = document.createElement("input");
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }
      }}
    >
      {copied ? "Скопировано" : "Копировать ссылку"}
    </button>
  );
}
