"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroContent } from "@/lib/types";

export default function Hero({
  content,
  brandCount,
}: {
  content: HeroContent;
  brandCount: number;
}) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ash text-cream">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={content.image}
          alt="Камин в интерьере"
          fill
          priority
          className="object-cover object-[center_35%]"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-ash via-ash/50 to-ash/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ash/75 via-ash/25 to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <motion.h1
              className="font-display text-[clamp(2.8rem,8vw,6.25rem)] leading-[0.92] text-cream"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {content.headline.includes("-") ? (
                <>
                  {content.headline.split("-")[0]}
                  <span className="text-ember-hot">-</span>
                  {content.headline.split("-").slice(1).join("-")}
                </>
              ) : (
                content.headline
              )}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-lg text-[15px] leading-relaxed text-cream/75 sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.7 }}
            >
              {content.subtitle}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.55 }}
            >
              <Link
                href="/catalog"
                className="inline-flex cursor-pointer items-center justify-center bg-ember px-7 py-3.5 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-ember-hot"
              >
                {content.ctaPrimary}
              </Link>
              <Link
                href="/calculator"
                className="inline-flex cursor-pointer items-center justify-center border border-cream/35 px-7 py-3.5 text-[12px] font-medium tracking-[0.14em] text-cream uppercase transition hover:border-cream hover:bg-cream/10"
              >
                {content.ctaSecondary}
              </Link>
            </motion.div>
          </div>

          <motion.ul
            className="flex max-w-sm flex-col gap-3 text-[13px] text-cream/55 sm:flex-row sm:gap-8 lg:flex-col lg:items-end lg:text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <li>{brandCount} брендов в шоуруме</li>
            <li>Гранит Елизаветинский</li>
            <li>Монтаж с гарантией</li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
