"use client";

import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";

const items = [
  {
    title: "Выбор без хаоса",
    text: "Покажем разницу между брендами и подскажем, что реально подойдёт вашему дому — без лишнего ассортимента.",
  },
  {
    title: "Камень и огонь вместе",
    text: "Топки, порталы и елизаветинский гранит в одном месте: облицовка, ступени и входные группы согласованы с очагом.",
  },
  {
    title: "До первого огня",
    text: "Доставка, монтаж и пусконаладка. После установки остаётесь с понятной инструкцией и поддержкой.",
  },
];

export default function Benefits() {
  return (
    <section className="border-b border-line bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display max-w-lg text-4xl leading-none text-ash sm:text-5xl">
              Почему с нами спокойнее
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-smoke md:text-right">
              Короткий путь: консультация → смета → доставка → монтаж.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="h-full border-t border-line pt-6">
                <h3 className="font-display text-2xl text-ash sm:text-[1.75rem]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-smoke sm:text-[15px]">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="inline-flex cursor-pointer text-[12px] font-medium tracking-[0.14em] text-ash uppercase border-b border-ash/30 pb-1 transition hover:border-ember hover:text-ember"
            >
              Узнать о MaxiKamin
            </Link>
            <Link
              href="/reviews"
              className="inline-flex cursor-pointer text-[12px] font-medium tracking-[0.14em] text-smoke uppercase border-b border-transparent pb-1 transition hover:text-ash"
            >
              Читать отзывы
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
