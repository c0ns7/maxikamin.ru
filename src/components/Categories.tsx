"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import type { CategoryRow } from "@/lib/db/schema";
import { Reveal } from "@/components/animations/Reveal";

const hints: Record<string, string> = {
  Топки: "Kratki, Экокамин, Brunner…",
  Порталы: "Madeira, мрамор",
  Печи: "La Nordica, Solzaima…",
  Облицовки: "Каминная облицовка",
  Камень: "Елизаветинский гранит",
  Биокамины: "Kratki и FireBird",
};

const popularOrder = [
  "Топки",
  "Порталы",
  "Печи",
  "Облицовки",
  "Камень",
  "Биокамины",
];

export default function Categories({
  categories,
  products,
}: {
  categories: CategoryRow[];
  products: Product[];
}) {
  const popular = popularOrder
    .map((name) => {
      const row = categories.find((c) => c.name === name);
      if (!row) return null;
      const fromProduct = products.find(
        (p) => p.category === name && p.image.includes("/catalog/"),
      );
      return {
        cat: row.name,
        hint: hints[row.name] ?? "Смотреть в каталоге",
        image: fromProduct?.image || row.image || "/images/hero.png",
      };
    })
    .filter(Boolean) as { cat: string; hint: string; image: string }[];

  return (
    <section className="bg-ash py-16 text-cream sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-4xl leading-none sm:text-5xl">
                С чего начать
              </h2>
              <p className="mt-3 max-w-md text-sm text-cream/55">
                Реальные позиции из каталога — выберите направление и сразу
                откройте фильтр.
              </p>
            </div>
            <Link
              href="/catalog"
              className="link-underline text-[12px] tracking-[0.16em] text-cream/60 uppercase hover:text-cream"
            >
              Весь каталог
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-2 sm:gap-4 sm:px-8 lg:px-10 scrollbar-none">
        {popular.map(({ cat, hint, image }, i) => (
          <Reveal key={cat} delay={i * 0.06} className="shrink-0">
            <Link
              href={`/catalog?category=${encodeURIComponent(cat)}`}
              className="group relative block h-[400px] w-[78vw] overflow-hidden sm:h-[500px] sm:w-[300px] lg:w-[320px]"
            >
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={image}
                  alt={cat}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ash/90 via-ash/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <h3 className="font-display text-3xl sm:text-[2rem]">{cat}</h3>
                <p className="mt-2 text-sm text-cream/55">{hint}</p>
                <span className="mt-5 inline-block text-[12px] tracking-widest text-cream/50 uppercase transition group-hover:text-cream">
                  Открыть
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
