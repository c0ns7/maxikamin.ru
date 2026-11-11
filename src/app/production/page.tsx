import Image from "next/image";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/db/queries";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const page = getSettings().pages.production;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

async function ProductionContent() {
  await connection();
  const page = getSettings().pages.production;
  const videos = [
    {
      src: page.video1,
      poster: page.video1Poster,
      label: page.video1Label,
    },
    {
      src: page.video2,
      poster: page.video2Poster,
      label: page.video2Label,
    },
  ].filter((v) => v.src.trim());

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
      {page.heroImage ? (
        <div className="relative mb-12 aspect-[21/9] overflow-hidden bg-linen-deep sm:mb-16 sm:aspect-[2.4/1]">
          <Image
            src={page.heroImage}
            alt={page.heroCaption || page.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-ash/40" />
          {page.heroCaption ? (
            <p className="absolute bottom-6 left-6 font-display text-2xl text-cream sm:bottom-10 sm:left-10 sm:text-4xl">
              {page.heroCaption}
            </p>
          ) : null}
        </div>
      ) : null}

      {videos.length > 0 ? (
        <div className="mb-16 grid gap-6 sm:grid-cols-2">
          {videos.map((v) => (
            <div
              key={v.src}
              className="overflow-hidden border border-ash/10 bg-ash"
            >
              <video
                className="aspect-video w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster={v.poster || undefined}
              >
                <source src={v.src} type="video/mp4" />
              </video>
              {v.label ? (
                <p className="px-4 py-3 text-xs tracking-wider text-cream/60 uppercase">
                  {v.label}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-14">
        {page.stages.map((s, i) => (
          <div
            key={`${s.n}-${s.title}-${i}`}
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {s.image ? (
              <div className="relative aspect-[5/4] overflow-hidden bg-linen-deep">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-[5/4] bg-linen-deep" />
            )}
            <div>
              {s.n ? (
                <span className="font-display text-2xl text-ember">{s.n}</span>
              ) : null}
              <h2 className="font-display mt-2 text-3xl text-ash sm:text-4xl">
                {s.title}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-smoke">
                {s.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export default function ProductionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-smoke">
          Загрузка…
        </div>
      }
    >
      <ProductionContent />
    </Suspense>
  );
}
