"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  deleteMediaAction,
  replaceMediaAction,
} from "@/app/admin/actions";
import CopyUrlButton from "@/components/admin/CopyUrlButton";
import { isUploadedMedia } from "@/lib/db/media-shared";

type MediaItem = {
  id: string;
  url: string;
  originalName: string;
  size: number;
};

export default function MediaItemCard({
  item,
  folder,
  q,
}: {
  item: MediaItem;
  folder?: string;
  q?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<"replace" | "delete" | null>(null);
  const uploadedItem = isUploadedMedia(item.url);
  const previewSrc = `${item.url}?v=${item.size}`;

  return (
    <article className="overflow-hidden rounded-xl border border-[#ddd6cb] bg-white shadow-[0_1px_0_rgba(26,23,20,0.04)]">
      <div className="relative aspect-[4/3] bg-[#efe9e0]">
        <Image
          src={previewSrc}
          alt={item.originalName}
          fill
          unoptimized
          className="object-cover"
          sizes="320px"
        />
        <span
          className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
            uploadedItem
              ? "bg-[#a84f32] text-white"
              : "bg-black/65 text-white"
          }`}
        >
          {uploadedItem ? "Загрузка" : "Каталог"}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="truncate text-sm font-medium">{item.originalName}</p>
          <p className="mt-1 break-all font-mono text-[11px] text-[#8a8176]">
            {item.url}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CopyUrlButton url={item.url} />

          <form action={replaceMediaAction} className="contents">
            <input type="hidden" name="id" value={item.id} />
            {folder ? <input type="hidden" name="folder" value={folder} /> : null}
            {q ? <input type="hidden" name="q" value={q} /> : null}
            <input
              ref={fileRef}
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              required
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPending("replace");
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button
              type="button"
              disabled={pending !== null}
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-md border border-[#ddd6cb] bg-white px-3 py-1.5 text-xs font-medium text-[#1a1714] transition hover:border-[#a84f32] hover:text-[#a84f32] disabled:opacity-50"
            >
              {pending === "replace" ? "Замена…" : "Заменить"}
            </button>
          </form>

          <form
            action={deleteMediaAction}
            onSubmit={(e) => {
              if (
                !window.confirm(
                  `Удалить файл?\n${item.url}\n\nСсылка в товарах перестанет открываться.`,
                )
              ) {
                e.preventDefault();
                return;
              }
              setPending("delete");
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            {folder ? <input type="hidden" name="folder" value={folder} /> : null}
            {q ? <input type="hidden" name="q" value={q} /> : null}
            <button
              type="submit"
              disabled={pending !== null}
              className="cursor-pointer rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
            >
              {pending === "delete" ? "Удаление…" : "Удалить"}
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
