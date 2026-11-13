"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductImages, isRemoteImage } from "@/lib/product-images";
import type { Product } from "@/lib/types";

export default function ProductGallery({ product }: { product: Product }) {
  const images = getProductImages(product);
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  const multi = images.length > 1;

  if (!current) {
    return <div className="aspect-[4/5] bg-linen-deep" />;
  }

  const go = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  return (
    <div className="space-y-3 lg:sticky lg:top-28 lg:self-start">
      <div className="relative aspect-[4/5] overflow-hidden bg-linen-deep">
        <Image
          key={current}
          src={current}
          alt={`${product.name} — фото ${index + 1}`}
          fill
          priority
          unoptimized={isRemoteImage(current)}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {multi ? (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-paper/90 text-ash backdrop-blur-sm transition hover:bg-paper"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-paper/90 text-ash backdrop-blur-sm transition hover:bg-paper"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="absolute right-3 bottom-3 bg-ash/70 px-2.5 py-1 text-[11px] tracking-wide text-cream tabular-nums backdrop-blur-sm">
              {index + 1} / {images.length}
            </p>
          </>
        ) : null}
      </div>

      {multi ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative h-16 w-14 shrink-0 overflow-hidden bg-linen-deep ${
                i === index ? "ring-2 ring-ember ring-offset-2 ring-offset-linen" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized={isRemoteImage(src)}
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
