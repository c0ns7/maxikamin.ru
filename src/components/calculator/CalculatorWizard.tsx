"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  calculateTotal,
  initialCalculatorState,
  isStepValid,
  isPhoneValid,
  type CalculatorState,
} from "@/lib/calculator";
import ProgressBar from "@/components/calculator/ProgressBar";
import SummaryCard from "@/components/calculator/SummaryCard";
import StepType from "@/components/calculator/StepType";
import StepParams from "@/components/calculator/StepParams";
import StepServices from "@/components/calculator/StepServices";
import StepSummary from "@/components/calculator/StepSummary";

export default function CalculatorWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<CalculatorState>(initialCalculatorState);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const result = useMemo(() => calculateTotal(state), [state]);
  const canNext = isStepValid(step, state);

  const patch = (partial: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const go = (next: number) => {
    setAnimKey((k) => k + 1);
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!canNext) return;
    if (step < 4) go(step + 1);
  };

  const handleBack = () => {
    if (step > 1) go(step - 1);
  };

  const handleRestart = () => {
    setState(initialCalculatorState);
    setShowSuccess(false);
    go(1);
  };

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const mobileCtaLabel = step === 4 ? "Отправить" : "Далее";

  const handleMobileCta = () => {
    if (step === 4) {
      if (
        state.name.trim().length >= 2 &&
        isPhoneValid(state.phone) &&
        state.consent
      ) {
        handleSubmit();
      }
      return;
    }
    handleNext();
  };

  return (
    <div className="bg-linen pb-28 lg:pb-16">
      <section className="relative overflow-hidden bg-ash text-cream">
        <Image
          src="/images/granite/production/workshop-polished-slab.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ash via-ash/85 to-ash/55" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-12 pt-28 sm:px-8 sm:pb-14 lg:px-10 lg:pt-32">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="font-display max-w-2xl text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.98] text-cream">
                Предварительный расчёт
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/70">
                Четыре коротких шага: изделие, параметры, услуги и заявка. Без
                регистрации — сумма сразу на экране.
              </p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-cream/55 sm:flex-row sm:gap-8 lg:flex-col lg:items-end lg:text-right">
              <li>Ориентир за 1–2 минуты</li>
              <li>Можно без звонка менеджеру</li>
              <li>
                Точнее — после{" "}
                <Link href="/catalog" className="text-cream/80 underline-offset-2 hover:underline">
                  выбора в каталоге
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <ProgressBar
        current={step}
        onStepClick={(n) => {
          if (n < step) go(n);
        }}
      />

      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
          <div className="min-w-0 border border-ash/10 bg-paper p-5 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={animKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 1 && <StepType state={state} onChange={patch} />}
                {step === 2 && <StepParams state={state} onChange={patch} />}
                {step === 3 && <StepServices state={state} onChange={patch} />}
                {step === 4 && (
                  <StepSummary
                    state={state}
                    result={result}
                    onChange={patch}
                    onSubmit={handleSubmit}
                    showSuccess={showSuccess}
                    onCloseSuccess={() => setShowSuccess(false)}
                    onRestart={handleRestart}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 hidden items-center justify-between gap-4 border-t border-ash/10 pt-8 lg:flex">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="cursor-pointer text-[12px] font-medium tracking-[0.14em] text-smoke uppercase transition hover:text-ash disabled:cursor-not-allowed disabled:opacity-30"
              >
                Назад
              </button>

              <div className="flex items-center gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="cursor-pointer text-[12px] tracking-[0.12em] text-smoke/70 uppercase transition hover:text-ash"
                  >
                    Сначала
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canNext}
                    className="cursor-pointer bg-ember px-8 py-3.5 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-ember-hot disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Далее
                  </button>
                )}
              </div>
            </div>

            {step < 4 && !canNext && (
              <p className="mt-4 hidden text-xs text-smoke lg:block">
                Выберите вариант выше, чтобы продолжить
              </p>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-36 space-y-4">
              <SummaryCard result={result} step={step} />
              <p className="px-1 text-xs leading-relaxed text-smoke">
                Нужна помощь с выбором?{" "}
                <a
                  href="tel:+74951234567"
                  className="text-ash underline-offset-2 hover:text-ember hover:underline"
                >
                  +7 (495) 123-45-67
                </a>
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-ash/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer border border-cream/30 px-3.5 py-3 text-cream"
              aria-label="Назад"
            >
              ←
            </button>
          )}
          <div className="min-w-0 flex-1">
            <SummaryCard result={result} compact />
          </div>
          <button
            type="button"
            onClick={handleMobileCta}
            disabled={!canNext}
            className="shrink-0 cursor-pointer bg-ember px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-cream uppercase disabled:opacity-40"
          >
            {mobileCtaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
