"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";

const services: {
  title: string;
  text: string;
  image: string;
  href?: string;
}[] = [
  {
    title: "Доставка",
    text: "По Москве — 4000 ₽ своим транспортом с экспедитором за 1–3 рабочих дня. В область — плюс 50 ₽/км от МКАД. В регионы — через ЖелДорЭкспедицию, ПЭК и Деловые линии с обрешёткой и страховкой.",
    image: "/images/delivery.png",
    href: "/delivery",
  },
  {
    title: "Монтаж",
    text: "Установка топок, печей, дымоходов и облицовки. Проектирование, подключение и пусконаладка одной командой.",
    image: "/images/montage.png",
  },
];

export default function Services() {
  return (
    <section className="bg-linen py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-4xl text-ash sm:text-5xl">
              Доставим и установим
            </h2>
            <Link
              href="/calculator"
              className="link-underline text-[12px] tracking-[0.14em] text-smoke uppercase hover:text-ash"
            >
              Добавить услуги в расчёт
            </Link>
          </div>
        </Reveal>

        <div className="space-y-16 lg:space-y-24">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <div
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-linen-deep">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={i % 2 === 1 ? "lg:pr-8" : "lg:pl-8"}>
                  <h3 className="font-display text-4xl text-ash sm:text-5xl">
                    {service.title}
                  </h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-smoke">
                    {service.text}
                  </p>
                  {service.href ? (
                    <Link
                      href={service.href}
                      className="link-underline mt-6 inline-block text-[12px] tracking-[0.14em] text-smoke uppercase hover:text-ash"
                    >
                      Подробнее о доставке
                    </Link>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
