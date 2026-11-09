"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";

export default function CalculatorTeaser({ image }: { image: string }) {
  return (
    <section className="relative min-h-[65vh] overflow-hidden bg-ash text-cream">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover opacity-40"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ash via-ash/75 to-ash/45" />

      <div className="relative z-10 mx-auto flex min-h-[65vh] max-w-[1400px] flex-col justify-center px-5 py-20 sm:px-8 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98]">
            Узнайте ориентир
            <br />
            по цене за минуту
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/65">
            Топка, печь, портал или гранит — предварительная смета с доставкой и
            монтажом, без звонка менеджеру.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/calculator"
              className="inline-flex cursor-pointer items-center justify-center bg-ember px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase transition hover:bg-ember-hot"
            >
              Рассчитать стоимость
            </Link>
            <Link
              href="/catalog"
              className="inline-flex cursor-pointer items-center justify-center border border-cream/30 px-8 py-4 text-[12px] font-medium tracking-[0.14em] uppercase transition hover:border-cream hover:bg-cream/10"
            >
              Сначала в каталог
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
