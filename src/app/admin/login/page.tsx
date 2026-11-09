import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { loginAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/ui";

export const instant = false;

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }
  const { error } = (await searchParams) ?? {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1714] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#241f1b] p-8 text-[#f4f2ee] shadow-2xl">
        <p className="text-[11px] tracking-[0.22em] text-[#c9b8a4] uppercase">
          Maxi-Kamin
        </p>
        <h1 className="mt-2 font-serif text-3xl">Вход в админку</h1>
        <p className="mt-2 text-sm text-[#a89c90]">
          Управление каталогом, контентом и настройками сайта.
        </p>
        {error ? (
          <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            Неверный пароль
          </p>
        ) : null}

        <form action={loginAction} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Пароль</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-md border border-white/15 bg-[#1a1714] px-3 py-2.5 text-sm outline-none focus:border-[#a84f32]"
              placeholder="Введите пароль"
            />
          </label>
          <SubmitButton>Войти</SubmitButton>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#1a1714] text-[#a89c90]">
          Загрузка…
        </div>
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
