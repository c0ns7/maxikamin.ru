"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  size?: "display" | "compact";
}

export default function CustomSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "Выберите",
  className = "",
  size = "display",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);
  const isDisplay = size === "display";

  useEffect(() => {
    if (!open) return;

    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label && (
        <span className="mb-3 block text-[11px] tracking-[0.2em] text-smoke uppercase">
          {label}
        </span>
      )}

      <motion.button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.98 }}
        className={`flex w-full items-center justify-between gap-3 text-left transition ${
          isDisplay
            ? `border-b py-3 font-display text-xl ${
                open ? "border-ember text-ash" : "border-ash/25 text-ash"
              }`
            : `border px-4 py-2.5 text-sm ${
                open
                  ? "border-ember bg-paper text-ash"
                  : "border-ash/20 bg-paper text-ash hover:border-ash/40"
              }`
        }`}
      >
        <span className={selected ? "" : "text-smoke"}>
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 ${open ? "text-ember" : "text-smoke"}`}
          />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 mt-2 max-h-64 w-full origin-top overflow-y-auto border border-ash/15 bg-paper shadow-[0_16px_40px_rgba(28,25,23,0.12)] ${
              isDisplay ? "py-2" : "py-1"
            }`}
          >
            {options.map((opt, i) => {
              const active = opt.value === value;
              return (
                <motion.li
                  key={opt.value}
                  role="option"
                  aria-selected={active}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 text-left transition ${
                      isDisplay ? "py-3 font-display text-lg" : "py-2.5 text-sm"
                    } ${
                      active
                        ? "bg-ash text-cream"
                        : "text-ash hover:bg-linen-deep"
                    }`}
                  >
                    {opt.label}
                    {active && <Check className="h-4 w-4 shrink-0 opacity-80" />}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
