import Image from "next/image";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import { brandAssortment, brands } from "@/lib/data";
import { getSettings, listBrands } from "@/lib/db/queries";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const page = getSettings().pages.about;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

async function AboutContent() {
  await connection();
  const page = getSettings().pages.about;
  const brandRows = listBrands();
  const brandNames =
    brandRows.length > 0 ? brandRows.map((b) => b.name) : [...brands];

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden bg-linen-deep lg:min-h-[520px] lg:aspect-auto">
          <Image
            src={page.image}
            alt={page.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          {page.body1
            .split(/\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => (
              <p
                key={p.slice(0, 40)}
                className="mt-5 text-[15px] leading-relaxed text-smoke first:mt-0"
              >
                {p}
              </p>
            ))}
          {page.body2
            .split(/\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => (
              <p
                key={p.slice(0, 40)}
                className="mt-5 text-[15px] leading-relaxed text-smoke"
              >
                {p}
              </p>
            ))}

          {page.facts.length > 0 ? (
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-ash/10 pt-10">
              {page.facts.map((f) => (
                <div key={`${f.n}-${f.label}`}>
                  <p className="font-display text-2xl text-ember sm:text-3xl">
                    {f.n}
                  </p>
                  <p className="mt-1 text-xs text-smoke">{f.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {page.showBrands ? (
        <section className="mt-20 border-t border-ash/10 pt-14">
          <h2 className="font-display text-3xl text-ash sm:text-4xl">
            {page.brandsTitle}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brandNames.map((brand) => {
              const assortment =
                brandRows.find((b) => b.name === brand)?.assortment ??
                brandAssortment[brand] ??
                [];
              return (
                <div
                  key={brand}
                  className="border border-ash/10 bg-paper p-5"
                >
                  <h3 className="font-display text-xl text-ash">{brand}</h3>
                  {assortment.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-sm text-smoke">
                      {assortment.map((line) => (
                        <li key={line}>— {line}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-smoke">
          Загрузка…
        </div>
      }
    >
      <AboutContent />
    </Suspense>
  );
}
