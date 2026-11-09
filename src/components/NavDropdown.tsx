"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface NavDropdownItem {
  href: string;
  label: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  /** Светлый текст на тёмном hero */
  light?: boolean;
}

export default function NavDropdown({ label, items, light }: NavDropdownProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = items.some((i) => pathname.startsWith(i.href));

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[0.14em] uppercase transition ${
          active || open ? "opacity-100" : "opacity-70 hover:opacity-100"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setOpen(false)}
            className={`absolute top-full left-0 z-50 mt-3 min-w-[12.5rem] border py-2 shadow-[0_16px_40px_rgba(28,25,23,0.14)] ${
              light
                ? "border-cream/15 bg-ash text-cream"
                : "border-ash/10 bg-paper text-ash"
            }`}
          >
            {items.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-5 py-2.5 text-[13px] tracking-wide transition ${
                    isActive
                      ? light
                        ? "bg-cream/10 text-ember-hot"
                        : "bg-linen-deep text-ember"
                      : light
                        ? "hover:bg-cream/5"
                        : "hover:bg-linen-deep"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
