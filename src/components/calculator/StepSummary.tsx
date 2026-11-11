"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { CalcResult, CalculatorState } from "@/lib/calculator";
import {
  formatCalcPrice,
  formatPhoneInput,
  isPhoneValid,
} from "@/lib/calculator";
import AnimatedPrice from "@/components/animations/AnimatedPrice";

interface StepSummaryProps {
  state: CalculatorState;
  result: CalcResult;
  onChange: (patch: Partial<CalculatorState>) => void;
  onSubmit: () => void;
  showSuccess: boolean;
  onCloseSuccess: () => void;
  onRestart?: () => void;
  phone?: string;
}

const fieldClass =
  "w-full border-b border-ash/25 bg-transparent py-3 text-[15px] text-ash outline-none transition placeholder:text-smoke/50 focus:border-ember";

export default function StepSummary({
  state,
  result,
  onChange,
  onSubmit,
  showSuccess,
  onCloseSuccess,
  onRestart,
  phone,
}: StepSummaryProps) {
  const [phoneTouched, setPhoneTouched] = useState(false);
  const phoneError =
    phoneTouched && state.phone.length > 0 && !isPhoneValid(state.phone);

  const canSubmit =
    state.name.trim().length >= 2 &&
    isPhoneValid(state.phone) &&
    state.consent;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPhoneTouched(true);
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-ash sm:text-4xl">
        Итог и заявка
      </h2>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-smoke">
        Проверьте ориентир и оставьте контакты — перезвоним и уточним смету под
        ваш объект.
      </p>

      <div className="mt-9 border border-ash bg-ash px-5 py-7 text-cream sm:px-7 sm:py-8">
        {result.productItems.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs text-cream/40">Изделие</p>
            <ul className="space-y-3">
              {result.productItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-cream/70">{item.label}</span>
                  <span className="shrink-0 tabular-nums">
                    {formatCalcPrice(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.serviceItems.length > 0 && (
          <div className="mb-6 border-t border-cream/15 pt-6">
            <p className="mb-3 text-xs text-cream/40">Услуги</p>
            <ul className="space-y-3">
              {result.serviceItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-cream/70">{item.label}</span>
                  <span className="shrink-0 tabular-nums">
                    {formatCalcPrice(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-cream/15 pt-6">
          <p className="text-xs text-cream/40">Предварительная сумма</p>
          <AnimatedPrice
            value={result.total}
            className="font-display mt-2 block text-4xl leading-none tracking-tight text-cream sm:text-5xl"
            duration={0.85}
          />
          <p className="mt-3 text-xs text-cream/40">
            Финальная цена — после замера и подбора комплектации
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-7">
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-ash">Имя *</span>
            <input
              required
              type="text"
              autoComplete="name"
              value={state.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Как к вам обращаться"
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-ash">Телефон *</span>
            <input
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={state.phone}
              onChange={(e) =>
                onChange({ phone: formatPhoneInput(e.target.value) })
              }
              onBlur={() => setPhoneTouched(true)}
              placeholder="+7 (___) ___-__-__"
              className={`${fieldClass} ${phoneError ? "border-red-500" : ""}`}
            />
            {phoneError && (
              <span className="mt-2 block text-xs text-red-600">
                Укажите номер в формате +7 (XXX) XXX-XX-XX
              </span>
            )}
          </label>
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-ash">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={state.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="Необязательно"
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-ash">Город</span>
            <input
              type="text"
              autoComplete="address-level2"
              value={state.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="Москва"
              className={fieldClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm text-ash">Комментарий</span>
          <textarea
            rows={3}
            value={state.comment}
            onChange={(e) => onChange({ comment: e.target.value })}
            placeholder="Адрес объекта, удобное время звонка…"
            className={`${fieldClass} resize-none`}
          />
        </label>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-smoke">
          <input
            type="checkbox"
            checked={state.consent}
            onChange={(e) => onChange({ consent: e.target.checked })}
            className="mt-1 h-4 w-4 accent-ember"
          />
          <span>
            Согласен на обработку персональных данных для связи по заявке{" "}
            <span className="text-ember">*</span>
          </span>
        </label>

        <div className="hidden flex-col gap-3 pt-2 lg:flex">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full cursor-pointer bg-ember py-4 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-ember-hot disabled:cursor-not-allowed disabled:opacity-40"
          >
            Отправить заявку
          </button>
          {phone ? (
            <p className="text-center text-xs text-smoke">
              Или позвоните:{" "}
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="text-ash hover:text-ember"
              >
                {phone}
              </a>
            </p>
          ) : null}
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-ash/70"
            aria-label="Закрыть"
            onClick={onCloseSuccess}
          />
          <div className="animate-toast-in relative w-full max-w-md border border-ash/10 bg-paper px-8 py-12 text-center">
            <button
              type="button"
              onClick={onCloseSuccess}
              className="absolute top-4 right-4 cursor-pointer p-1.5 text-smoke hover:text-ash"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-4xl text-ash">Заявка принята</h3>
            <p className="mt-4 text-sm leading-relaxed text-smoke">
              Мы свяжемся в течение рабочего дня и уточним смету под ваш объект.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  onCloseSuccess();
                  onRestart?.();
                }}
                className="cursor-pointer bg-ash px-5 py-3 text-[12px] font-medium tracking-[0.14em] text-cream uppercase hover:bg-ember"
              >
                Новый расчёт
              </button>
              <Link
                href="/catalog"
                className="text-[12px] tracking-[0.12em] text-smoke uppercase hover:text-ash"
              >
                В каталог
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
