"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import CartButton from "@/components/cart/CartButton";
import HeaderSearch from "@/components/HeaderSearch";
import NavDropdown from "@/components/NavDropdown";
import PhoneMenu from "@/components/PhoneMenu";
import { contactPhones } from "@/lib/contacts";
import { aboutMenu } from "@/lib/nav";
import type { SiteContacts } from "@/lib/types";

function SearchFallback({ light }: { light?: boolean }) {
  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center ${
        light ? "opacity-80" : "text-ash/70"
      }`}
      aria-hidden
    >
      <Search className="h-4 w-4" />
    </span>
  );
}

const nav = [
  { href: "/catalog", label: "Каталог" },
  { href: "/promo", label: "Акции" },
  { href: "/calculator", label: "Расчёт" },
];

export default function Header({ contacts }: { contacts: SiteContacts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const onDarkHero = pathname === "/" || pathname.startsWith("/calculator");
  const aboutActive = aboutMenu.some((i) => pathname.startsWith(i.href));
  const solid = scrolled || open || !onDarkHero;
  const phones = contactPhones(contacts);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
  }, [pathname]);

  const closeMobile = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  if (isAdmin) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-300 ${
        solid
          ? "bg-linen/95 text-ash shadow-[0_1px_0_rgba(28,25,23,0.08)] backdrop-blur-md"
          : "bg-transparent text-cream"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={closeMobile}
          className="font-display text-[1.55rem] leading-none tracking-tight sm:text-[1.75rem]"
        >
          Maxi<span className="text-ember-hot">Kamin</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:gap-8 md:flex">
          <Suspense fallback={<SearchFallback light={!solid && onDarkHero} />}>
            <HeaderSearch light={!solid && onDarkHero} />
          </Suspense>

          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`link-underline text-[13px] font-medium tracking-[0.12em] uppercase ${
                  active ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <NavDropdown
            label="О магазине"
            items={[...aboutMenu]}
            light={!solid && onDarkHero}
          />

          <PhoneMenu
            phones={phones}
            light={!solid && onDarkHero}
            className="hidden xl:block"
          />
          <CartButton />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Suspense fallback={<SearchFallback light={!solid && onDarkHero} />}>
            <HeaderSearch light={!solid && onDarkHero} />
          </Suspense>
          <CartButton />
          <button
            type="button"
            className="cursor-pointer p-1"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-linen px-5 py-6 text-ash md:hidden">
          <nav className="flex flex-col gap-1">
            <div className="mb-3">
              <Suspense fallback={null}>
                <HeaderSearch expanded onSearch={closeMobile} />
              </Suspense>
            </div>
            <Link href="/" onClick={closeMobile} className="py-2.5 text-lg">
              Главная
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className="py-2.5 text-lg"
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              className={`flex cursor-pointer items-center justify-between py-2.5 text-left text-lg ${
                aboutActive ? "text-ember" : ""
              }`}
            >
              О магазине
              <ChevronDown
                className={`h-4 w-4 transition ${aboutOpen ? "rotate-180" : ""}`}
              />
            </button>
            {aboutOpen && (
              <div className="mb-2 ml-3 flex flex-col gap-1 border-l border-ash/15 pl-4">
                {aboutMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="py-2 text-base text-smoke"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-4">
              <PhoneMenu phones={phones} variant="button" className="w-full" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
