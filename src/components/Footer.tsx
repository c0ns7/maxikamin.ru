"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutMenu } from "@/lib/nav";
import type { SiteContacts } from "@/lib/types";

export default function Footer({ contacts }: { contacts: SiteContacts }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-line bg-ash text-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <Link
          href="/"
          className="font-display block text-[clamp(2.5rem,8vw,6rem)] leading-none tracking-tight"
        >
          Maxi<span className="text-ember-hot">-</span>Kamin
        </Link>

        <div className="mt-14 grid gap-10 border-t border-cream/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-cream/40 uppercase">
              Каталог
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>
                <Link href="/catalog" className="hover:text-cream">
                  Все товары
                </Link>
              </li>
              <li>
                <Link href="/promo" className="hover:text-cream">
                  Акции
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-cream">
                  Калькулятор
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] text-cream/40 uppercase">
              О магазине
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              {aboutMenu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] text-cream/40 uppercase">
              Услуги
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>Доставка</li>
              <li>Монтаж</li>
              <li>Проектирование</li>
              <li>Сервис</li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] text-cream/40 uppercase">
              Контакты
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>
                <a
                  href={`tel:${contacts.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-cream"
                >
                  {contacts.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contacts.email}`}
                  className="hover:text-cream"
                >
                  {contacts.email}
                </a>
              </li>
              <li>{contacts.site}</li>
              {contacts.address ? <li>{contacts.address}</li> : null}
            </ul>
          </div>
        </div>

        <p className="mt-14 text-xs text-cream/30">© 2026 Maxi-Kamin</p>
      </div>
    </footer>
  );
}
