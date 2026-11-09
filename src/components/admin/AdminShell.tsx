"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  FolderTree,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Images,
  MessageSquareQuote,
  Package,
  Settings,
  Tags,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/products", label: "Каталог", icon: Package },
  { href: "/admin/media", label: "Галерея", icon: ImagePlus },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/brands", label: "Бренды", icon: Tags },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquareQuote },
  { href: "/admin/promos", label: "Акции", icon: Megaphone },
  { href: "/admin/portfolio", label: "Портфолио", icon: Images },
  { href: "/admin/settings", label: "Сайт", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f2ee] text-[#1a1714]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#ddd6cb] bg-[#1a1714] px-4 py-6 text-[#f4f2ee] md:flex">
          <Link href="/admin" className="px-2">
            <p className="text-[11px] tracking-[0.2em] text-[#c9b8a4] uppercase">
              Maxi-Kamin
            </p>
            <p className="mt-1 font-serif text-2xl">Кабинет</p>
          </Link>

          <nav className="mt-10 flex flex-1 flex-col gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-[#a84f32] text-white"
                      : "text-[#d7cec2] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#d7cec2] hover:bg-white/5"
            >
              <Boxes className="h-4 w-4" />
              Открыть сайт
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#d7cec2] hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#ddd6cb] bg-[#f4f2ee]/95 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="md:hidden">
                <p className="text-sm font-medium">Админ Maxi-Kamin</p>
              </div>
              <div className="hidden text-sm text-[#6f675e] md:block">
                Панель управления контентом
              </div>
              <Link
                href="/"
                className="text-sm text-[#a84f32] hover:underline md:hidden"
              >
                На сайт
              </Link>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                    pathname.startsWith(l.href)
                      ? "bg-[#1a1714] text-white"
                      : "bg-white text-[#6f675e]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
