"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/types";
import CatalogFilters, { type FilterState } from "@/components/CatalogFilters";
import ProductCard from "@/components/ProductCard";
import CustomSelect from "@/components/ui/CustomSelect";
import Link from "next/link";

type SortKey = "default" | "price-asc" | "price-desc" | "name";

const initialFilters: FilterState = {
  category: "",
  brand: "",
  priceMin: "",
  priceMax: "",
};

export default function CatalogClient({
  products,
  categories,
  brands,
  phone,
}: {
  products: Product[];
  categories: string[];
  brands: string[];
  phone?: string;
}) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";
  const brandFromUrl = searchParams.get("brand") ?? "";
  const queryFromUrl = (searchParams.get("q") ?? "").trim();

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...initialFilters,
    category: categoryFromUrl || "",
    brand: brandFromUrl || "",
  }));
  const [sort, setSort] = useState<SortKey>("default");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryFromUrl || "",
      brand: brandFromUrl || "",
    }));
  }, [categoryFromUrl, brandFromUrl]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (queryFromUrl) {
      const terms = queryFromUrl.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const hay = [
          p.name,
          p.brand,
          p.category,
          p.line ?? "",
          p.description ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return terms.every((term) => hay.includes(term));
      });
    }

    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.brand) {
      list = list.filter((p) => p.brand === filters.brand);
    }
    const min = filters.priceMin ? Number(filters.priceMin) : null;
    const max = filters.priceMax ? Number(filters.priceMax) : null;
    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((p) => p.price >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((p) => p.price <= max);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
        break;
      default:
        break;
    }

    return list;
  }, [filters, sort, products, queryFromUrl]);

  const activeLabel =
    queryFromUrl || filters.category || filters.brand || null;

  return (
    <div className="mx-auto flex max-w-[1400px] gap-12 px-5 pb-20 pt-28 sm:px-8 lg:px-10 lg:pt-32">
      <CatalogFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialFilters)}
        mobileOpen={mobileFilters}
        onCloseMobile={() => setMobileFilters(false)}
        categories={categories}
        brands={brands}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-10 flex flex-col gap-6 border-b border-line pb-8 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl text-ash sm:text-5xl">
              Каталог
            </h1>
            <p className="mt-2 text-sm text-smoke">
              {activeLabel ? (
                <>
                  {queryFromUrl ? "Поиск" : "Показано"}:{" "}
                  <span className="text-ash">
                    {queryFromUrl ? `«${queryFromUrl}»` : activeLabel}
                  </span>
                  {" · "}
                </>
              ) : null}
              {filtered.length}{" "}
              {filtered.length === 1
                ? "позиция"
                : filtered.length < 5
                  ? "позиции"
                  : "позиций"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="inline-flex cursor-pointer items-center gap-2 border border-line px-4 py-2.5 text-[12px] font-medium tracking-wider text-ash uppercase lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
            </button>

            <div className="flex min-w-[200px] items-center gap-3">
              <span className="shrink-0 text-[12px] tracking-wider text-smoke uppercase">
                Сортировка
              </span>
              <CustomSelect
                value={sort}
                onChange={(v) => setSort(v as SortKey)}
                size="compact"
                className="min-w-[160px] flex-1"
                options={[
                  { value: "default", label: "По умолчанию" },
                  { value: "price-asc", label: "Сначала дешевле" },
                  { value: "price-desc", label: "Сначала дороже" },
                  { value: "name", label: "По названию" },
                ]}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-line px-6 py-16 text-center sm:py-20">
            <p className="font-display text-2xl text-ash">Ничего не нашлось</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-smoke">
              {queryFromUrl
                ? "Попробуйте другой запрос или сбросьте поиск и фильтры."
                : "Сбросьте фильтры или посмотрите весь каталог — возможно, нужная модель в другой категории."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {queryFromUrl ? (
                <Link
                  href="/catalog"
                  className="inline-flex cursor-pointer border border-ash bg-ash px-5 py-2.5 text-[12px] font-medium tracking-wider text-cream uppercase hover:bg-ember hover:border-ember"
                >
                  Сбросить поиск
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setFilters(initialFilters)}
                  className="cursor-pointer border border-ash bg-ash px-5 py-2.5 text-[12px] font-medium tracking-wider text-cream uppercase hover:bg-ember hover:border-ember"
                >
                  Сбросить фильтры
                </button>
              )}
              <Link
                href="/calculator"
                className="inline-flex cursor-pointer border border-ash/25 px-5 py-2.5 text-[12px] font-medium tracking-wider text-ash uppercase hover:border-ember hover:text-ember"
              >
                Рассчитать под заказ
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-line pt-10 text-center">
          <p className="text-sm text-smoke">
            Не нашли нужную модель? Поможем подобрать и посчитаем монтаж.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="text-[12px] font-medium tracking-[0.12em] text-ash uppercase hover:text-ember"
              >
                {phone}
              </a>
            ) : null}
            <Link
              href="/calculator"
              className="text-[12px] font-medium tracking-[0.12em] text-smoke uppercase hover:text-ash"
            >
              Калькулятор
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
