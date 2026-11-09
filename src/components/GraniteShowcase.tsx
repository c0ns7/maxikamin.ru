"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import type { Product } from "@/lib/types";

const lines = [
  "Плитка",
  "Брусчатка",
  "Ступени",
  "Столешницы",
  "Подоконники",
  "Уличные входные группы",
] as const;

function shotFor(products: Product[], line: string) {
  const match = products.find(
    (x) =>
      x.brand === "Елизаветинский" &&
      x.line === line &&
      x.image.includes("/catalog/elizavetinsky/"),
  );
  if (match) return match.image;
  return (
    products.find((x) => x.brand === "Елизаветинский" && x.line === line)
      ?.image ?? "/images/catalog/elizavetinsky/balt-00.jpg"
  );
}

export default function GraniteShowcase({ products }: { products: Product[] }) {
  const shots = lines.map((label) => ({
    label,
    src: shotFor(products, label),
  }));

  return (
    <section className="bg-linen py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h2 className="font-display text-4xl leading-none text-ash sm:text-5xl">
                Изделия из гранита
                <br />
                Елизаветинский
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-smoke lg:justify-self-end">
              Полный каталог камня: плитка, брусчатка, подоконники, ступени,
              столешницы и уличные входные группы — с фото и ценами.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {shots.map((shot, i) => (
            <Reveal key={shot.label} delay={i * 0.05}>
              <Link
                href={`/catalog?category=${encodeURIComponent("Камень")}&brand=${encodeURIComponent("Елизаветинский")}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-linen-deep"
              >
                <Image
                  src={shot.src}
                  alt={shot.label}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ash/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-xl text-cream sm:text-2xl">
                  {shot.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/catalog?category=${encodeURIComponent("Камень")}`}
            className="inline-flex cursor-pointer border border-ash bg-ash px-6 py-3.5 text-[12px] font-medium tracking-[0.14em] text-cream uppercase transition hover:bg-ember hover:border-ember"
          >
            Открыть каталог камня
          </Link>
          <Link
            href="/production"
            className="inline-flex cursor-pointer border border-ash/25 px-6 py-3.5 text-[12px] font-medium tracking-[0.14em] text-ash uppercase transition hover:border-ember hover:text-ember"
          >
            Производство
          </Link>
        </div>
      </div>
    </section>
  );
}
