"use client";

import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { contactPhones, telHref } from "@/lib/contacts";
import type { SiteContacts } from "@/lib/types";

export default function FinalCTA({ contacts }: { contacts: SiteContacts }) {
  const phone = contactPhones(contacts)[0];

  return (
    <section className="border-t border-line bg-ash py-16 text-cream sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
                Готовы подобрать очаг
                <br />
                или гранит под ваш проект?
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-cream/65">
                Напишите или позвоните — поможем с выбором топки, портала и
                каменных изделий. Можно начать с быстрого расчёта на сайте.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-start lg:items-end">
              {phone ? (
                <a
                  href={telHref(phone)}
                  className="inline-flex w-full cursor-pointer items-center justify-center bg-ember px-7 py-4 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-ember-hot sm:w-auto"
                >
                  Позвонить
                </a>
              ) : null}
              <Link
                href="/calculator"
                className="inline-flex w-full cursor-pointer items-center justify-center border border-cream/30 px-7 py-4 text-[12px] font-medium tracking-[0.14em] text-cream uppercase transition hover:border-cream hover:bg-cream/10 sm:w-auto"
              >
                Открыть калькулятор
              </Link>
              <a
                href={`mailto:${contacts.email}`}
                className="mt-2 text-sm text-cream/50 transition hover:text-cream"
              >
                {contacts.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
