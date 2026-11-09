"use client";

import { X } from "lucide-react";

export interface FilterState {
  category: string;
  brand: string;
  priceMin: string;
  priceMax: string;
}

interface CatalogFiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  categories: string[];
  brands: string[];
}

export default function CatalogFilters({
  filters,
  onChange,
  onReset,
  mobileOpen = false,
  onCloseMobile,
  categories,
  brands,
}: CatalogFiltersProps) {
  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-graphite">Фильтры</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-amber hover:text-amber-hover"
        >
          Сбросить
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-graphite uppercase">
          Категория
        </h3>
        <ul className="space-y-2">
          <li>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-graphite">
              <input
                type="radio"
                name="category"
                checked={filters.category === ""}
                onChange={() => onChange({ ...filters, category: "" })}
                className="accent-amber"
              />
              Все
            </label>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-graphite">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => onChange({ ...filters, category: cat })}
                  className="accent-amber"
                />
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-graphite uppercase">
          Бренд
        </h3>
        <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
          <li>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-graphite">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === ""}
                onChange={() => onChange({ ...filters, brand: "" })}
                className="accent-amber"
              />
              Все
            </label>
          </li>
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-graphite">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand}
                  onChange={() => onChange({ ...filters, brand })}
                  className="accent-amber"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-graphite uppercase">
          Цена, ₽
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="от"
            min={0}
            value={filters.priceMin}
            onChange={(e) =>
              onChange({ ...filters, priceMin: e.target.value })
            }
            className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-amber"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            placeholder="до"
            min={0}
            value={filters.priceMax}
            onChange={(e) =>
              onChange({ ...filters, priceMax: e.target.value })
            }
            className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-amber"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-white p-6">
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-graphite/50"
            aria-label="Закрыть фильтры"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-cream shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-serif text-lg">Фильтры</span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-xl p-2 hover:bg-cream-dark"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{content}</div>
            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full rounded-2xl bg-amber py-3 text-sm font-semibold text-cream"
              >
                Показать результаты
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
