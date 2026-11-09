import { connection } from "next/server";
import {
  changePasswordAction,
  saveSettingsAction,
} from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminCard,
  AdminPageHeader,
  Field,
  SubmitButton,
} from "@/components/admin/ui";
import { getSettings } from "@/lib/db/queries";

async function SettingsContent({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; pwd?: string }>;
}) {
  await connection();
  const { saved, pwd } = (await searchParams) ?? {};
  const s = getSettings();

  const pwdMessage =
    pwd === "ok"
      ? { tone: "ok", text: "Пароль обновлён." }
      : pwd === "bad"
        ? { tone: "err", text: "Текущий пароль неверный." }
        : pwd === "mismatch"
          ? { tone: "err", text: "Новый пароль и подтверждение не совпадают." }
          : pwd === "short"
            ? { tone: "err", text: "Новый пароль должен быть не короче 8 символов." }
            : null;

  return (
    <div>
      <AdminPageHeader
        title="Настройки сайта"
        description="Контакты, герой главной, SEO, популярные товары и пароль админки."
      />

      {saved ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Настройки сохранены.
        </p>
      ) : null}
      {pwdMessage ? (
        <p
          className={`mb-4 rounded-md border px-3 py-2 text-sm ${
            pwdMessage.tone === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {pwdMessage.text}
        </p>
      ) : null}

      <form action={saveSettingsAction} className="space-y-6">
        <AdminCard>
          <h2 className="font-serif text-xl">Контакты</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Телефон" name="phone" defaultValue={s.contacts.phone} />
            <Field label="Email" name="email" defaultValue={s.contacts.email} />
            <Field label="Сайт" name="site" defaultValue={s.contacts.site} />
            <Field
              label="Адрес"
              name="address"
              defaultValue={s.contacts.address}
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-serif text-xl">Hero на главной</h2>
          <div className="mt-4 grid gap-4">
            <Field
              label="Заголовок"
              name="headline"
              defaultValue={s.hero.headline}
            />
            <Field
              label="Подзаголовок"
              name="subtitle"
              rows={3}
              defaultValue={s.hero.subtitle}
            />
            <Field
              label="Фоновое изображение"
              name="heroImage"
              defaultValue={s.hero.image}
              hint="URL из раздела «Галерея»"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Кнопка 1"
                name="ctaPrimary"
                defaultValue={s.hero.ctaPrimary}
              />
              <Field
                label="Кнопка 2"
                name="ctaSecondary"
                defaultValue={s.hero.ctaSecondary}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-serif text-xl">Популярное и SEO</h2>
          <div className="mt-4 space-y-4">
            <Field
              label="ID популярных товаров"
              name="featuredProductIds"
              rows={4}
              defaultValue={s.featuredProductIds.join("\n")}
              hint="По одному ID на строку"
            />
            <Field
              label="Meta title"
              name="metaTitle"
              defaultValue={s.metaTitle}
            />
            <Field
              label="Meta description"
              name="metaDescription"
              rows={3}
              defaultValue={s.metaDescription}
            />
          </div>
        </AdminCard>

        <SubmitButton>Сохранить настройки</SubmitButton>
      </form>

      <AdminCard className="mt-8">
        <h2 className="font-serif text-xl">Смена пароля</h2>
        <p className="mt-2 text-sm text-[#6f675e]">
          Новый пароль сохраняется в базе и используется при следующем входе.
        </p>
        <form action={changePasswordAction} className="mt-4 grid max-w-md gap-3">
          <Field
            label="Текущий пароль"
            name="currentPassword"
            type="password"
            required
          />
          <Field
            label="Новый пароль"
            name="newPassword"
            type="password"
            required
            hint="Минимум 8 символов"
          />
          <Field
            label="Повторите новый пароль"
            name="confirmPassword"
            type="password"
            required
          />
          <SubmitButton>Обновить пароль</SubmitButton>
        </form>
      </AdminCard>
    </div>
  );
}

export default function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; pwd?: string }>;
}) {
  return (
    <AdminSuspense>
      <SettingsContent searchParams={searchParams} />
    </AdminSuspense>
  );
}
