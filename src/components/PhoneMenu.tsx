"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";
import { telHref } from "@/lib/contacts";

interface PhoneMenuProps {
  phones: string[];
  light?: boolean;
  className?: string;
  /** Компактная кнопка для мобильного меню */
  variant?: "nav" | "button";
}

export default function PhoneMenu({
  phones,
  light,
  className = "",
  variant = "nav",
}: PhoneMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const primary = phones[0];
  const multi = phones.length > 1;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!primary) return null;

  if (!multi) {
    if (variant === "button") {
      return (
        <a
          href={telHref(primary)}
          className={`inline-flex items-center justify-center bg-ember px-5 py-3.5 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase ${className}`}
        >
          Позвонить
        </a>
      );
    }
    return (
      <a
        href={telHref(primary)}
        className={`text-[13px] tracking-wide transition ${
          light
            ? "opacity-80 hover:opacity-100"
            : "text-ash/80 hover:text-ember"
        } ${className}`}
      >
        {primary}
      </a>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {variant === "button" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-ember px-5 py-3.5 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase"
          aria-expanded={open}
          aria-haspopup="true"
        >
          Позвонить
          <ChevronDown
            className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setOpen(true)}
          className={`inline-flex cursor-pointer items-center gap-1.5 text-[13px] tracking-wide transition ${
            light
              ? "opacity-80 hover:opacity-100"
              : "text-ash/80 hover:text-ember"
          }`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {primary}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => variant === "nav" && setOpen(false)}
            className={`absolute z-50 mt-2 min-w-[15rem] overflow-hidden border py-1.5 shadow-[0_16px_40px_rgba(28,25,23,0.14)] ${
              variant === "button" ? "inset-x-0 top-full" : "top-full right-0"
            } ${
              light || variant === "button"
                ? "border-cream/15 bg-ash text-cream"
                : "border-ash/10 bg-paper text-ash"
            }`}
          >
            {phones.map((phone) => (
              <a
                key={phone}
                href={telHref(phone)}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] tracking-wide transition ${
                  light || variant === "button"
                    ? "hover:bg-cream/10"
                    : "hover:bg-linen-deep"
                }`}
              >
                <Phone className="h-3.5 w-3.5 shrink-0 opacity-50" />
                <span>{phone}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
