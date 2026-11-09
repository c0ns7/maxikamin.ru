/** Цены и формулы калькулятора — правьте здесь. */

export type ProductType =
  | "fireplace"
  | "firebox"
  | "stove"
  | "chimney"
  | "stone";

export type StoneSubtype =
  | "countertop"
  | "windowsill"
  | "stairs"
  | "paving"
  | "tile";

export type FuelType = "wood" | "gas" | "electric";

export type StoneMaterial = "granite" | "marble" | "quartzite";

export type DeliveryZone = "moscow" | "mo" | "regions";

export type CalcBrand =
  | "none"
  | "Елизаветинский"
  | "Madeira"
  | "Экокамин"
  | "Kratki"
  | "ABX"
  | "IldNord"
  | "FireBird"
  | "La Nordica"
  | "Solzaima"
  | "MCZ"
  | "AVES"
  | "Schmid"
  | "Brunner"
  | "Hoxter"
  | "Феникс";

export interface CalculatorState {
  type: ProductType | null;
  stoneSubtype: StoneSubtype | null;
  power: number;
  fuel: FuelType;
  material: StoneMaterial;
  width: number;
  depth: number;
  brand: CalcBrand;
  delivery: boolean;
  deliveryZone: DeliveryZone;
  mountFireplace: boolean;
  mountStove: boolean;
  mountEntrance: boolean;
  mountCountertop: boolean;
  dismantle: boolean;
  name: string;
  phone: string;
  email: string;
  city: string;
  comment: string;
  consent: boolean;
}

export interface LineItem {
  id: string;
  label: string;
  amount: number;
}

export interface CalcResult {
  productItems: LineItem[];
  serviceItems: LineItem[];
  total: number;
  area: number;
}

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  fireplace: "Камин",
  firebox: "Топка",
  stove: "Печь",
  chimney: "Дымоход",
  stone: "Изделие из камня",
};

export const STONE_SUBTYPE_LABELS: Record<StoneSubtype, string> = {
  countertop: "Столешница",
  windowsill: "Подоконник",
  stairs: "Лестница",
  paving: "Брусчатка",
  tile: "Плитка",
};

export const FUEL_LABELS: Record<FuelType, string> = {
  wood: "Дрова",
  gas: "Газ",
  electric: "Электричество",
};

export const MATERIAL_LABELS: Record<StoneMaterial, string> = {
  granite: "Гранит",
  marble: "Мрамор",
  quartzite: "Кварцит",
};

export const DELIVERY_ZONE_LABELS: Record<DeliveryZone, string> = {
  moscow: "Москва",
  mo: "Московская область",
  regions: "Регионы",
};

export const BRAND_OPTIONS: { value: CalcBrand; label: string }[] = [
  { value: "none", label: "Не важно" },
  { value: "Елизаветинский", label: "Елизаветинский" },
  { value: "Madeira", label: "Madeira" },
  { value: "Экокамин", label: "Экокамин" },
  { value: "Kratki", label: "Kratki" },
  { value: "ABX", label: "ABX" },
  { value: "IldNord", label: "IldNord" },
  { value: "FireBird", label: "FireBird" },
  { value: "La Nordica", label: "La Nordica" },
  { value: "Solzaima", label: "Solzaima" },
  { value: "MCZ", label: "MCZ" },
  { value: "AVES", label: "AVES" },
  { value: "Schmid", label: "Schmid" },
  { value: "Brunner", label: "Brunner" },
  { value: "Hoxter", label: "Hoxter" },
  { value: "Феникс", label: "Феникс" },
];

/** Базовые цены по типу изделия (₽) */
export const BASE_PRICES: Record<Exclude<ProductType, "stone">, number> = {
  fireplace: 80000,
  firebox: 45000,
  stove: 60000,
  chimney: 25000,
};

/** Цена камня за м² (₽) */
export const STONE_PRICE_PER_M2: Record<StoneMaterial, number> = {
  granite: 12000,
  marble: 18000,
  quartzite: 15000,
};

/** Премиум-бренды — множитель 1.6; остальные выбранные — 1.2; «Не важно» — 1.0 */
export const PREMIUM_BRANDS: CalcBrand[] = [
  "La Nordica",
  "MCZ",
  "Brunner",
  "Schmid",
  "Hoxter",
  "Madeira",
];

export const BRAND_MULTIPLIER = {
  none: 1.0,
  economy: 1.2,
  premium: 1.6,
} as const;

/** Услуги: базовые цены (₽) */
export const SERVICE_PRICES = {
  delivery: {
    moscow: 3000,
    mo: 5000,
    regions: 9000,
  },
  mountFireplace: 15000,
  mountStove: 18000,
  mountEntrance: 20000,
  mountCountertop: 8000,
  dismantle: 5000,
} as const;

/** Наценка за мощность: +15% за каждые 4 кВт свыше 6 */
export const POWER_SURCHARGE_STEP_KW = 4;
export const POWER_SURCHARGE_PERCENT = 0.15;
export const POWER_BASE_KW = 6;

export const POWER_MIN = 6;
export const POWER_MAX = 20;

export const initialCalculatorState: CalculatorState = {
  type: null,
  stoneSubtype: null,
  power: 10,
  fuel: "wood",
  material: "granite",
  width: 1.5,
  depth: 0.6,
  brand: "none",
  delivery: false,
  deliveryZone: "moscow",
  mountFireplace: false,
  mountStove: false,
  mountEntrance: false,
  mountCountertop: false,
  dismantle: false,
  name: "",
  phone: "",
  email: "",
  city: "",
  comment: "",
  consent: false,
};

export function getBrandMultiplier(brand: CalcBrand): number {
  if (brand === "none") return BRAND_MULTIPLIER.none;
  if (PREMIUM_BRANDS.includes(brand)) return BRAND_MULTIPLIER.premium;
  return BRAND_MULTIPLIER.economy;
}

export function getPowerSurchargeFactor(power: number): number {
  const steps = Math.floor(
    Math.max(0, power - POWER_BASE_KW) / POWER_SURCHARGE_STEP_KW,
  );
  return 1 + steps * POWER_SURCHARGE_PERCENT;
}

export function getArea(width: number, depth: number): number {
  const w = Number.isFinite(width) ? Math.max(0, width) : 0;
  const d = Number.isFinite(depth) ? Math.max(0, depth) : 0;
  return Math.round(w * d * 100) / 100;
}

export function roundToHundreds(value: number): number {
  return Math.round(value / 100) * 100;
}

export function formatCalcPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function isHeatingType(type: ProductType | null): boolean {
  return type === "fireplace" || type === "firebox" || type === "stove";
}

/** Грубая оценка отапливаемой площади: ~1 кВт на 10 м² */
export function estimateHeatedArea(powerKw: number): number {
  return Math.round(powerKw * 10);
}

export function calculateTotal(state: CalculatorState): CalcResult {
  const productItems: LineItem[] = [];
  const serviceItems: LineItem[] = [];
  const area = getArea(state.width, state.depth);
  const brandMul = getBrandMultiplier(state.brand);
  const brandLabel =
    state.brand === "none"
      ? ""
      : ` · ${BRAND_OPTIONS.find((b) => b.value === state.brand)?.label}`;

  if (state.type === "stone") {
    const perM2 = STONE_PRICE_PER_M2[state.material];
    const raw = perM2 * area * brandMul;
    const amount = roundToHundreds(raw);
    const subtype = state.stoneSubtype
      ? STONE_SUBTYPE_LABELS[state.stoneSubtype]
      : "Камень";
    productItems.push({
      id: "stone",
      label: `${subtype} (${MATERIAL_LABELS[state.material]}, ${area} м²)${brandLabel}`,
      amount,
    });
  } else if (state.type) {
    let raw = BASE_PRICES[state.type] * brandMul;
    if (isHeatingType(state.type)) {
      raw *= getPowerSurchargeFactor(state.power);
    }
    const amount = roundToHundreds(raw);
    const powerPart = isHeatingType(state.type)
      ? ` · ${state.power} кВт · ${FUEL_LABELS[state.fuel]}`
      : "";
    productItems.push({
      id: "product",
      label: `${PRODUCT_TYPE_LABELS[state.type]}${powerPart}${brandLabel}`,
      amount,
    });
  }

  if (state.delivery) {
    serviceItems.push({
      id: "delivery",
      label: `Доставка (${DELIVERY_ZONE_LABELS[state.deliveryZone]})`,
      amount: SERVICE_PRICES.delivery[state.deliveryZone],
    });
  }

  if (state.mountFireplace) {
    const extra = isHeatingType(state.type)
      ? Math.max(0, state.power - POWER_BASE_KW) * 500
      : 0;
    serviceItems.push({
      id: "mountFireplace",
      label: "Монтаж камина / топки",
      amount: roundToHundreds(SERVICE_PRICES.mountFireplace + extra),
    });
  }

  if (state.mountStove) {
    const extra = isHeatingType(state.type)
      ? Math.max(0, state.power - POWER_BASE_KW) * 500
      : 0;
    serviceItems.push({
      id: "mountStove",
      label: "Монтаж печи",
      amount: roundToHundreds(SERVICE_PRICES.mountStove + extra),
    });
  }

  if (state.mountEntrance) {
    serviceItems.push({
      id: "mountEntrance",
      label: "Монтаж входной группы",
      amount: SERVICE_PRICES.mountEntrance,
    });
  }

  if (state.mountCountertop) {
    const extra = state.type === "stone" ? area * 2000 : 0;
    serviceItems.push({
      id: "mountCountertop",
      label: "Установка столешницы / подоконника",
      amount: roundToHundreds(SERVICE_PRICES.mountCountertop + extra),
    });
  }

  if (state.dismantle) {
    serviceItems.push({
      id: "dismantle",
      label: "Демонтаж старого оборудования",
      amount: SERVICE_PRICES.dismantle,
    });
  }

  const total = roundToHundreds(
    [...productItems, ...serviceItems].reduce((s, i) => s + i.amount, 0),
  );

  return { productItems, serviceItems, total, area };
}

export function isStep1Valid(state: CalculatorState): boolean {
  if (!state.type) return false;
  if (state.type === "stone" && !state.stoneSubtype) return false;
  return true;
}

export function isStep2Valid(state: CalculatorState): boolean {
  if (!state.type) return false;
  if (isHeatingType(state.type)) {
    return state.power >= POWER_MIN && state.power <= POWER_MAX && !!state.fuel;
  }
  if (state.type === "stone") {
    return state.width > 0 && state.depth > 0 && !!state.material;
  }
  return true;
}

export function isStep3Valid(): boolean {
  return true;
}

/** Простая проверка: +7 и ещё 10 цифр */
export function isPhoneValid(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("7");
}

export function isStep4Valid(state: CalculatorState): boolean {
  return (
    state.name.trim().length >= 2 &&
    isPhoneValid(state.phone) &&
    state.consent
  );
}

export function isStepValid(step: number, state: CalculatorState): boolean {
  switch (step) {
    case 1:
      return isStep1Valid(state);
    case 2:
      return isStep2Valid(state);
    case 3:
      return isStep3Valid();
    case 4:
      return isStep4Valid(state);
    default:
      return false;
  }
}

/** Маска телефона +7 (XXX) XXX-XX-XX */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);

  const p = digits.slice(1);
  let result = "+7";
  if (p.length > 0) result += " (" + p.slice(0, 3);
  if (p.length >= 3) result += ")";
  if (p.length > 3) result += " " + p.slice(3, 6);
  if (p.length > 6) result += "-" + p.slice(6, 8);
  if (p.length > 8) result += "-" + p.slice(8, 10);
  return result;
}
