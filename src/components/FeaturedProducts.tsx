"use client";

import type { Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { Reveal } from "@/components/animations/Reveal";
import Link from "next/link";

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  const [lead, ...rest] = products;

  return (
    <section className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-4xl leading-none text-ash sm:text-5xl">
                Популярное сейчас
              </h2>
              <p className="mt-3 max-w-md text-sm text-smoke">
                Портал Madeira, топка Kratki, гранит Елизаветинский и печь La
                Nordica — позиции с фото из каталога.
              </p>
            </div>
            <Link
              href="/catalog"
              className="link-underline text-[12px] tracking-[0.16em] text-smoke uppercase hover:text-ash"
            >
              Все позиции
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {lead && (
            <div className="lg:col-span-7">
              <ProductCard product={lead} index={0} featured />
            </div>
          )}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-8">
            {rest.slice(0, 2).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i + 1}
                compact
              />
            ))}
          </div>
        </div>

        {rest.length > 2 && (
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {rest.slice(2).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i + 3}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
