"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CalcResult } from "@/lib/calculator";
import { formatCalcPrice } from "@/lib/calculator";
import AnimatedPrice from "@/components/animations/AnimatedPrice";

interface SummaryCardProps {
  result: CalcResult;
  compact?: boolean;
  step?: number;
}

export default function SummaryCard({
  result,
  compact,
  step = 1,
}: SummaryCardProps) {
  const hasItems =
    result.productItems.length > 0 || result.serviceItems.length > 0;
  const lines = [...result.productItems, ...result.serviceItems];

  if (compact) {
    return (
      <div>
        <p className="text-[10px] tracking-[0.16em] text-cream/45 uppercase">
          Ориентир
        </p>
        <AnimatedPrice
          value={result.total}
          className="font-display text-2xl leading-none text-cream"
        />
      </div>
    );
  }

  return (
    <div className="border border-ash bg-ash px-6 py-7 text-cream sm:px-7 sm:py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl leading-none text-cream sm:text-3xl">
            Ваша смета
          </h3>
          <p className="mt-2 text-xs text-cream/45">Шаг {step} из 4</p>
        </div>
        {hasItems && (
          <span className="shrink-0 border border-cream/20 px-2 py-1 text-[10px] tracking-[0.12em] text-cream/55 uppercase">
            Онлайн
          </span>
        )}
      </div>

      {!hasItems ? (
        <p className="mt-8 text-sm leading-relaxed text-cream/45">
          Выберите тип изделия — здесь появится предварительная сумма.
        </p>
      ) : (
        <ul className="mt-7 max-h-[240px] space-y-3 overflow-y-auto border-b border-cream/15 pb-5 scrollbar-none">
          <AnimatePresence initial={false} mode="popLayout">
            {lines.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <span className="leading-snug text-cream/55">{item.label}</span>
                <span className="shrink-0 tabular-nums text-cream">
                  {formatCalcPrice(item.amount)}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-6">
        <p className="text-[11px] tracking-[0.16em] text-cream/40 uppercase">
          Итого ориентировочно
        </p>
        <AnimatedPrice
          value={result.total}
          className="font-display mt-2 block text-[2.5rem] leading-none tracking-tight text-cream sm:text-[2.75rem]"
          duration={0.75}
        />
        <p className="mt-4 text-xs leading-relaxed text-cream/40">
          Не договор. Точную цену подтвердим после замера и комплектации.
        </p>
      </div>
    </div>
  );
}
