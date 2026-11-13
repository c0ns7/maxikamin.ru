"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface HeaderSearchProps {
  light?: boolean;
  /** Always expanded (mobile menu) */
  expanded?: boolean;
  onSearch?: () => void;
  className?: string;
}

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
        if (!query.trim()) setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
  }, [open, expanded, query]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) {
      router.push("/catalog");
      onSearch?.();
      return;
    }
    router.push(`/catalog?q=${encodeURIComponent(q)}`);
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

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form
        onSubmit={submit}
        className={`flex items-center gap-2 border px-3 py-1.5 transition ${
          expanded ? "w-full" : "w-[min(100vw-6rem,16rem)] sm:w-52 lg:w-60"
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск товаров…"
          aria-label="Поиск товаров"
          className={`min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:opacity-50 ${
            onDark ? "text-cream placeholder:text-cream/60" : "text-ash"
          }`}
        />
        {query ? (
          <button
            type="button"
            aria-label="Очистить"
            onClick={() => {
              setQuery("");
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
    </div>
  );
}
