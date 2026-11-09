"use client";

import { motion } from "framer-motion";
import type {
  CalculatorState,
  ProductType,
  StoneSubtype,
} from "@/lib/calculator";
import {
  PRODUCT_TYPE_LABELS,
  STONE_SUBTYPE_LABELS,
} from "@/lib/calculator";

const TYPES: { id: ProductType; hint: string }[] = [
  { id: "fireplace", hint: "Портал и готовый очаг" },
  { id: "firebox", hint: "Встраиваемая камера" },
  { id: "stove", hint: "Автономный прибор" },
  { id: "chimney", hint: "Дымоудаление" },
  { id: "stone", hint: "Гранит и изделия" },
];

const STONE_OPTIONS: StoneSubtype[] = [
  "countertop",
  "windowsill",
  "stairs",
  "paving",
  "tile",
];

interface StepTypeProps {
  state: CalculatorState;
  onChange: (patch: Partial<CalculatorState>) => void;
}

export default function StepType({ state, onChange }: StepTypeProps) {
  return (
    <div>
      <h2 className="font-display text-3xl text-ash sm:text-4xl">
        Что считаем?
      </h2>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-smoke">
        Выберите одно направление — от него зависят параметры и доступные
        услуги.
      </p>

      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {TYPES.map(({ id, hint }) => {
          const active = state.type === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() =>
                onChange({
                  type: id,
                  stoneSubtype: id === "stone" ? state.stoneSubtype : null,
                })
              }
              className={`group cursor-pointer border p-5 text-left transition sm:p-6 ${
                active
                  ? "border-ash bg-ash text-cream"
                  : "border-ash/15 bg-white text-ash hover:border-ash/40"
              }`}
            >
              <span
                className={`font-display block text-2xl sm:text-[1.75rem] ${
                  active ? "text-cream" : "text-ash"
                }`}
              >
                {PRODUCT_TYPE_LABELS[id]}
              </span>
              <span
                className={`mt-2 block text-sm ${
                  active ? "text-cream/55" : "text-smoke"
                }`}
              >
                {hint}
              </span>
            </button>
          );
        })}
      </div>

      {state.type === "stone" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 border-t border-ash/10 pt-8"
        >
          <p className="mb-1 font-display text-xl text-ash">Какое изделие?</p>
          <p className="mb-4 text-sm text-smoke">
            Для елизаветинского гранита и других камней
          </p>
          <div className="flex flex-wrap gap-2">
            {STONE_OPTIONS.map((sub) => {
              const active = state.stoneSubtype === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onChange({ stoneSubtype: sub })}
                  className={`cursor-pointer border px-4 py-2.5 text-sm transition ${
                    active
                      ? "border-ember bg-ember text-cream"
                      : "border-ash/20 bg-white text-ash hover:border-ash"
                  }`}
                >
                  {STONE_SUBTYPE_LABELS[sub]}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
