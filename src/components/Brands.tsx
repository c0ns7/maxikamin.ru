"use client";

import { Reveal } from "@/components/animations/Reveal";

export default function Brands({ brands }: { brands: string[] }) {
  const loop = [...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-line bg-linen-deep/40 py-14 sm:py-16">
      <Reveal>
        <p className="mb-8 px-5 text-center text-[11px] font-medium tracking-[0.28em] text-smoke uppercase sm:px-8">
          Бренды в шоуруме
        </p>
      </Reveal>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-linen to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-linen to-transparent sm:w-24" />
        <div className="marquee-track gap-10 px-6 sm:gap-16">
          {loop.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-display shrink-0 text-3xl text-ash/35 transition hover:text-ember sm:text-4xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
