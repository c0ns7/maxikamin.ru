"use client";

import type { CalculatorState, FuelType, StoneMaterial } from "@/lib/calculator";
import {
  BRAND_OPTIONS,
  FUEL_LABELS,
  MATERIAL_LABELS,
  POWER_MAX,
  POWER_MIN,
  getArea,
  estimateHeatedArea,
  isHeatingType,
  STONE_PRICE_PER_M2,
  formatCalcPrice,
} from "@/lib/calculator";
import CustomSelect from "@/components/ui/CustomSelect";

interface StepParamsProps {
  state: CalculatorState;
  onChange: (patch: Partial<CalculatorState>) => void;
}

export default function StepParams({ state, onChange }: StepParamsProps) {
  const heating = isHeatingType(state.type);
  const stone = state.type === "stone";
  const area = getArea(state.width, state.depth);
  const heatedArea = estimateHeatedArea(state.power);

  return (
    <div>
      <h2 className="font-display text-3xl text-ash sm:text-4xl">Параметры</h2>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-smoke">
        Чем точнее данные, тем ближе ориентир к реальной смете. Всё можно
        уточнить на замере.
      </p>

      <div className="mt-10 space-y-10">
        {heating && (
          <>
            <div className="border border-ash/10 bg-linen-deep/40 p-5 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <label
                    htmlFor="power"
                    className="text-sm font-medium text-ash"
                  >
                    Мощность
                  </label>
                  <p className="mt-1 text-xs text-smoke">
                    Ориентир: ≈ {heatedArea} м² отапливаемой площади
                  </p>
                </div>
                <p className="font-display text-5xl leading-none text-ember tabular-nums sm:text-6xl">
                  {state.power}
                  <span className="ml-1.5 text-xl text-smoke">кВт</span>
                </p>
              </div>
              <input
                id="power"
                type="range"
                min={POWER_MIN}
                max={POWER_MAX}
                step={1}
                value={state.power}
                onChange={(e) => onChange({ power: Number(e.target.value) })}
                className="mt-8 h-1.5 w-full cursor-pointer appearance-none bg-ash/15 accent-ember"
              />
              <div className="mt-2 flex justify-between text-xs text-smoke">
                <span>{POWER_MIN} кВт</span>
                <span>{POWER_MAX} кВт</span>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-ash">Топливо</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(FUEL_LABELS) as FuelType[]).map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => onChange({ fuel })}
                    className={`cursor-pointer border px-3 py-3.5 text-sm transition ${
                      state.fuel === fuel
                        ? "border-ash bg-ash text-cream"
                        : "border-ash/15 bg-white text-ash hover:border-ash/40"
                    }`}
                  >
                    {FUEL_LABELS[fuel]}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {stone && (
          <>
            <div>
              <p className="mb-3 text-sm font-medium text-ash">Материал</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(MATERIAL_LABELS) as StoneMaterial[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ material: m })}
                    className={`cursor-pointer border p-5 text-left transition ${
                      state.material === m
                        ? "border-ash bg-ash text-cream"
                        : "border-ash/15 bg-white text-ash hover:border-ash/40"
                    }`}
                  >
                    <span className="font-display block text-2xl">
                      {MATERIAL_LABELS[m]}
                    </span>
                    <span
                      className={`mt-2 block text-xs ${
                        state.material === m ? "text-cream/60" : "text-smoke"
                      }`}
                    >
                      от {formatCalcPrice(STONE_PRICE_PER_M2[m])}/м²
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-ash/10 bg-white p-5 sm:p-7">
              <p className="mb-1 text-sm font-medium text-ash">Размеры, м</p>
              <p className="mb-5 text-xs text-smoke">
                Ширина × глубина — для оценки площади
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-smoke">Ширина</span>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    inputMode="decimal"
                    value={state.width || ""}
                    onChange={(e) =>
                      onChange({ width: Number(e.target.value) || 0 })
                    }
                    className="w-full border-b border-ash/25 bg-transparent py-3 font-display text-2xl text-ash outline-none focus:border-ember"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-smoke">Глубина</span>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    inputMode="decimal"
                    value={state.depth || ""}
                    onChange={(e) =>
                      onChange({ depth: Number(e.target.value) || 0 })
                    }
                    className="w-full border-b border-ash/25 bg-transparent py-3 font-display text-2xl text-ash outline-none focus:border-ember"
                  />
                </label>
              </div>
              <p className="mt-6 text-sm text-ash">
                Площадь:{" "}
                <span className="font-display text-2xl text-ember">{area} м²</span>
              </p>
            </div>
          </>
        )}

        {state.type === "chimney" && (
          <div className="border border-ash/10 bg-linen-deep/50 px-5 py-4 text-sm leading-relaxed text-ash/80">
            Считаем базовый комплект дымохода. Длину, диаметр и конфигурацию
            уточним после осмотра объекта.
          </div>
        )}

        <div className="relative z-20">
          <CustomSelect
            label="Бренд (необязательно)"
            value={state.brand}
            options={BRAND_OPTIONS.map((b) => ({
              value: b.value,
              label: b.label,
            }))}
            onChange={(v) =>
              onChange({ brand: v as CalculatorState["brand"] })
            }
            size="display"
          />
          <p className="mt-3 text-xs leading-relaxed text-smoke">
            Премиум: Madeira, La Nordica, MCZ, Brunner, Schmid, Hoxter.
            «Не важно» — средний ориентир по рынку.
          </p>
        </div>
      </div>
    </div>
  );
}
