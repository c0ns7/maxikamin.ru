"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface HeaderSearchProps {
  light?: boolean;
  /** Always expanded (mobile menu) */
  expanded?: boolean;
  onSearch?: () => void;
  className?: string;
}

type Suggestion = {
  id: string;
  name: string;
  brand: string;
  price: number;
  priceLabel: string;
};

const DEBOUNCE_MS = 3000;

export default function HeaderSearch({
  light,
  expanded = false,
  onSearch,
  className = "",
}: HeaderSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(expanded);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (expanded) setOpen(true);
  }, [expanded]);

  useEffect(() => {
    if (!open || expanded) return;
    inputRef.current?.focus();
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setShowList(false);
        if (!query.trim()) setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showList) {
          setShowList(false);
          return;
        }
        if (!query.trim()) setOpen(false);
        else setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, expanded, query, showList]);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setShowList(false);
      return;
    }

    setLoading(false);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as { items: Suggestion[] };
        setSuggestions(data.items ?? []);
        setShowList(true);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSuggestions([]);
        setShowList(false);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  const goCatalog = (q: string) => {
    if (!q) router.push("/catalog");
    else router.push(`/catalog?q=${encodeURIComponent(q)}`);
    setShowList(false);
    onSearch?.();
    if (!expanded) setOpen(false);
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    goCatalog(query.trim());
  };

  const pickProduct = (id: string) => {
    router.push(`/product/${id}`);
    setShowList(false);
    onSearch?.();
    if (!expanded) setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Поиск товаров"
        className={`inline-flex cursor-pointer items-center justify-center transition ${
          light
            ? "opacity-80 hover:opacity-100"
            : "text-ash/70 hover:text-ember"
        } ${className}`}
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  const onDark = light && !expanded;
  const q = query.trim();
  const waitingHints = q.length >= 2 && !showList && !loading;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form
        onSubmit={submit}
        className={`flex items-center gap-2 border px-3 py-1.5 transition ${
          expanded ? "w-full" : "w-[min(100vw-6rem,18rem)] sm:w-56 lg:w-64"
        } ${
          onDark
            ? "border-cream/25 bg-cream/10 text-cream"
            : "border-ash/15 bg-paper text-ash"
        }`}
      >
        <Search
          className={`h-3.5 w-3.5 shrink-0 ${
            onDark ? "opacity-70" : "text-smoke"
          }`}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowList(false);
          }}
          onFocus={() => {
            if (suggestions.length) setShowList(true);
          }}
          placeholder="Поиск товаров…"
          aria-label="Поиск товаров"
          aria-autocomplete="list"
          aria-expanded={showList}
          className={`min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:opacity-50 ${
            onDark ? "text-cream placeholder:text-cream/60" : "text-ash"
          }`}
          autoComplete="off"
        />
        {loading ? (
          <span
            className={`h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent opacity-50`}
            aria-hidden
          />
        ) : query ? (
          <button
            type="button"
            aria-label="Очистить"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setShowList(false);
              inputRef.current?.focus();
            }}
            className="cursor-pointer opacity-50 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : !expanded ? (
          <button
            type="button"
            aria-label="Закрыть поиск"
            onClick={() => setOpen(false)}
            className="cursor-pointer opacity-50 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </form>

      {showList && q.length >= 2 ? (
        <div
          className={`absolute top-full left-0 z-[60] mt-2 max-h-80 w-[min(100vw-2.5rem,22rem)] overflow-auto border py-1 shadow-[0_16px_40px_rgba(28,25,23,0.14)] ${
            expanded ? "inset-x-0 w-auto" : ""
          } ${
            onDark
              ? "border-cream/15 bg-ash text-cream"
              : "border-ash/10 bg-paper text-ash"
          }`}
        >
          {suggestions.length === 0 ? (
            <p
              className={`px-4 py-3 text-[13px] ${
                onDark ? "text-cream/55" : "text-smoke"
              }`}
            >
              Ничего не найдено
            </p>
          ) : (
            <ul>
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => pickProduct(item.id)}
                    className={`flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-2.5 text-left transition ${
                      onDark ? "hover:bg-cream/10" : "hover:bg-linen-deep"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] leading-snug">
                        {item.name}
                      </span>
                      <span
                        className={`mt-0.5 block text-[11px] ${
                          onDark ? "text-cream/45" : "text-smoke"
                        }`}
                      >
                        {item.brand}
                      </span>
                    </span>
                    <span className="shrink-0 text-[13px] tabular-nums">
                      {item.priceLabel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog"}
            onClick={() => {
              setShowList(false);
              onSearch?.();
              if (!expanded) setOpen(false);
            }}
            className={`block border-t px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] uppercase transition ${
              onDark
                ? "border-cream/10 text-cream/70 hover:bg-cream/10 hover:text-cream"
                : "border-ash/10 text-smoke hover:bg-linen-deep hover:text-ash"
            }`}
          >
            Все результаты
          </Link>
        </div>
      ) : null}

      {waitingHints ? (
        <p
          className={`absolute top-full left-0 z-[60] mt-2 whitespace-nowrap px-1 text-[11px] ${
            onDark ? "text-cream/50" : "text-smoke"
          }`}
        >
          Подсказки через 3 сек…
        </p>
      ) : null}
    </div>
  );
}
