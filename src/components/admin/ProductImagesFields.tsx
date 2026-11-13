"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import {
  MAX_PRODUCT_IMAGES,
  normalizeProductImages,
} from "@/lib/product-images";

export default function ProductImagesFields({
  initialImages,
}: {
  initialImages?: string[];
}) {
  const start = normalizeProductImages(initialImages);
  const [urls, setUrls] = useState<string[]>(
    start.length ? start : [""],
  );

  const update = (index: number, value: string) => {
    setUrls((prev) => prev.map((u, i) => (i === index ? value : u)));
  };

  const remove = (index: number) => {
    setUrls((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [""];
    });
  };

  const add = () => {
    setUrls((prev) =>
      prev.length >= MAX_PRODUCT_IMAGES ? prev : [...prev, ""],
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-[#1a1714]">Фотографии</p>
          <p className="mt-1 text-xs text-[#8a8176]">
            До {MAX_PRODUCT_IMAGES} ссылок. Первая — обложка в каталоге.
            Берите URL из галереи.
          </p>
        </div>
        <Link
          href="/admin/media"
          className="text-xs text-[#a84f32] hover:underline"
          target="_blank"
        >
          Открыть галерею →
        </Link>
      </div>

      <div className="space-y-2">
        {urls.map((url, i) => (
          <div key={i} className="flex items-start gap-2">
            <label className="min-w-0 flex-1 text-sm">
              <span className="mb-1 block text-xs text-[#8a8176]">
                {i === 0 ? "Обложка (1)" : `Фото ${i + 1}`}
              </span>
              <input
                name={`image_${i}`}
                value={url}
                onChange={(e) => update(i, e.target.value)}
                required={i === 0}
                placeholder="/images/... или /uploads/gallery/..."
                className="w-full rounded-md border border-[#ddd6cb] bg-[#fbfaf8] px-3 py-2.5 text-sm outline-none transition focus:border-[#a84f32] focus:bg-white"
              />
            </label>
            {urls.length > 1 ? (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Удалить фото ${i + 1}`}
                className="mt-6 inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {urls.length < MAX_PRODUCT_IMAGES ? (
        <button
          type="button"
          onClick={add}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#ddd6cb] bg-white px-3 py-2 text-sm text-[#1a1714] hover:border-[#a84f32] hover:text-[#a84f32]"
        >
          <Plus className="h-4 w-4" />
          Добавить фото
        </button>
      ) : (
        <p className="text-xs text-[#8a8176]">Достигнут лимит 10 фото.</p>
      )}
    </div>
  );
}
