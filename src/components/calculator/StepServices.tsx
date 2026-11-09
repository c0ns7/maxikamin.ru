"use client";

import type { CalculatorState, DeliveryZone } from "@/lib/calculator";
import {
  DELIVERY_ZONE_LABELS,
  SERVICE_PRICES,
  formatCalcPrice,
} from "@/lib/calculator";

interface StepServicesProps {
  state: CalculatorState;
  onChange: (patch: Partial<CalculatorState>) => void;
}

type ServiceKey = keyof Pick<
  CalculatorState,
  | "delivery"
  | "mountFireplace"
  | "mountStove"
  | "mountEntrance"
  | "mountCountertop"
  | "dismantle"
>;

interface ServiceToggle {
  key: ServiceKey;
  label: string;
  hint: string;
  relevant: (state: CalculatorState) => boolean;
}

const SERVICES: ServiceToggle[] = [
  {
    key: "delivery",
    label: "Доставка",
    hint: "Цена зависит от зоны",
    relevant: () => true,
  },
  {
    key: "mountFireplace",
    label: "Монтаж камина / топки",
    hint: `от ${formatCalcPrice(SERVICE_PRICES.mountFireplace)}`,
    relevant: (s) =>
      s.type === "fireplace" || s.type === "firebox" || s.type === null,
  },
  {
    key: "mountStove",
    label: "Монтаж печи",
    hint: `от ${formatCalcPrice(SERVICE_PRICES.mountStove)}`,
    relevant: (s) => s.type === "stove" || s.type === null,
  },
  {
    key: "mountEntrance",
    label: "Монтаж входной группы",
    hint: formatCalcPrice(SERVICE_PRICES.mountEntrance),
    relevant: (s) =>
      s.type === "stone" &&
      (s.stoneSubtype === "stairs" ||
        s.stoneSubtype === "paving" ||
        s.stoneSubtype === null),
  },
  {
    key: "mountCountertop",
    label: "Установка столешницы / подоконника",
    hint: `от ${formatCalcPrice(SERVICE_PRICES.mountCountertop)}`,
    relevant: (s) =>
      s.type === "stone" &&
      (s.stoneSubtype === "countertop" ||
        s.stoneSubtype === "windowsill" ||
        s.stoneSubtype === "tile" ||
        s.stoneSubtype === null),
  },
  {
    key: "dismantle",
    label: "Демонтаж старого оборудования",
    hint: formatCalcPrice(SERVICE_PRICES.dismantle),
    relevant: () => true,
  },
];

export default function StepServices({ state, onChange }: StepServicesProps) {
  const visible = SERVICES.filter((svc) => svc.relevant(state));
  // Always show any already-checked services even if filter would hide them
  const list = SERVICES.filter(
    (svc) => svc.relevant(state) || state[svc.key],
  );

  return (
    <div>
      <h2 className="font-display text-3xl text-ash sm:text-4xl">Услуги</h2>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-smoke">
        Можно пропустить — оставить только изделие. Показаны услуги, которые
        обычно идут с вашим выбором.
      </p>

      <ul className="mt-9 divide-y divide-ash/10 border-y border-ash/10">
        {list.map((svc) => {
          const checked = state[svc.key];
          const recommended = visible.includes(svc);
          return (
            <li key={svc.key}>
              <label
                className={`flex cursor-pointer items-start gap-4 px-1 py-5 transition sm:items-center sm:gap-5 sm:px-2 ${
                  checked ? "bg-linen-deep/40" : ""
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition sm:mt-0 ${
                    checked
                      ? "border-ember bg-ember text-cream"
                      : "border-ash/30 bg-white"
                  }`}
                  aria-hidden
                >
                  {checked && <span className="block h-1.5 w-1.5 bg-cream" />}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange({ [svc.key]: e.target.checked })}
                  className="sr-only"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl text-ash sm:text-2xl">
                      {svc.label}
                    </span>
                    {recommended && !checked && (
                      <span className="text-[10px] tracking-[0.12em] text-ember uppercase">
                        часто берут
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-smoke">
                    {svc.hint}
                  </span>
                </span>
              </label>

              {svc.key === "delivery" && state.delivery && (
                <div className="mb-5 ml-9 flex flex-wrap gap-2 sm:ml-11">
                  {(Object.keys(DELIVERY_ZONE_LABELS) as DeliveryZone[]).map(
                    (zone) => (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => onChange({ deliveryZone: zone })}
                        className={`cursor-pointer border px-3.5 py-2 text-xs transition ${
                          state.deliveryZone === zone
                            ? "border-ash bg-ash text-cream"
                            : "border-ash/15 bg-white text-ash hover:border-ash/40"
                        }`}
                      >
                        {DELIVERY_ZONE_LABELS[zone]} ·{" "}
                        {formatCalcPrice(SERVICE_PRICES.delivery[zone])}
                      </button>
                    ),
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-smoke">
        Ничего не выбрано? Нажмите «Далее» — посчитаем только изделие.
      </p>
    </div>
  );
}
