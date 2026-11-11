import { connection } from "next/server";
import Link from "next/link";
import { savePagesAction } from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminCard,
  AdminPageHeader,
  Checkbox,
  Field,
  SubmitButton,
} from "@/components/admin/ui";
import { getSettings } from "@/lib/db/queries";

const tabs = [
  { id: "about", label: "О нас", href: "/about" },
  { id: "production", label: "Производство", href: "/production" },
  { id: "contacts", label: "Контакты", href: "/contacts" },
  { id: "delivery", label: "Доставка", href: "/delivery" },
] as const;

async function PagesContent({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; tab?: string }>;
}) {
  await connection();
  const params = (await searchParams) ?? {};
  const saved = params.saved;
  const tab =
    tabs.find((t) => t.id === params.tab)?.id ??
    tabs.find((t) => t.id === saved)?.id ??
    "about";
  const s = getSettings();
  const about = s.pages.about;
  const production = s.pages.production;
  const contactsPage = s.pages.contacts;
  const deliveryPage = s.pages.delivery;

  const aboutFacts = Array.from({ length: 6 }, (_, i) => about.facts[i] ?? {
    n: "",
    label: "",
  });
  const stages = Array.from({ length: 6 }, (_, i) => production.stages[i] ?? {
    n: "",
    title: "",
    text: "",
    image: "",
  });

  return (
    <div>
      <AdminPageHeader
        title="Страницы"
        description="Тексты и медиа для разделов «О нас», «Производство», «Контакты» и «Доставка»."
      />

      {saved ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Раздел «{tabs.find((t) => t.id === saved)?.label ?? saved}» сохранён.
        </p>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/pages?tab=${t.id}`}
            className={`rounded-full px-4 py-2 text-sm transition ${
              tab === t.id
                ? "bg-[#1a1714] text-white"
                : "bg-white text-[#6f675e] ring-1 ring-[#ddd6cb] hover:text-[#1a1714]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "about" ? (
        <form action={savePagesAction} className="space-y-6">
          <input type="hidden" name="page" value="about" />
          <AdminCard>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl">О нас</h2>
              <Link
                href="/about"
                className="text-sm text-[#a84f32] hover:underline"
                target="_blank"
              >
                Открыть страницу
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Надзаголовок" name="eyebrow" defaultValue={about.eyebrow} />
              <Field label="Заголовок" name="title" defaultValue={about.title} />
              <div className="sm:col-span-2">
                <Field label="Лид" name="lead" rows={3} defaultValue={about.lead} />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Изображение"
                  name="image"
                  defaultValue={about.image}
                  hint="URL из «Галереи»"
                />
              </div>
              <div className="sm:col-span-2">
                <Field label="Текст 1" name="body1" rows={5} defaultValue={about.body1} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Текст 2" name="body2" rows={4} defaultValue={about.body2} />
              </div>
              <Field
                label="Заголовок блока брендов"
                name="brandsTitle"
                defaultValue={about.brandsTitle}
              />
              <div className="flex items-end pb-2">
                <Checkbox
                  label="Показывать блок брендов"
                  name="showBrands"
                  defaultChecked={about.showBrands}
                />
              </div>
              <Field
                label="Meta title"
                name="metaTitle"
                defaultValue={about.metaTitle}
              />
              <Field
                label="Meta description"
                name="metaDescription"
                rows={2}
                defaultValue={about.metaDescription}
              />
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-serif text-xl">Факты</h2>
            <p className="mt-1 text-sm text-[#6f675e]">
              Пустые строки не показываются на сайте.
            </p>
            <div className="mt-4 space-y-3">
              {aboutFacts.map((fact, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[8rem_1fr]">
                  <Field label={`Значение ${i + 1}`} name={`fact_n_${i}`} defaultValue={fact.n} />
                  <Field
                    label={`Подпись ${i + 1}`}
                    name={`fact_label_${i}`}
                    defaultValue={fact.label}
                  />
                </div>
              ))}
            </div>
          </AdminCard>

          <SubmitButton>Сохранить «О нас»</SubmitButton>
        </form>
      ) : null}

      {tab === "production" ? (
        <form action={savePagesAction} className="space-y-6">
          <input type="hidden" name="page" value="production" />
          <AdminCard>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl">Производство</h2>
              <Link
                href="/production"
                className="text-sm text-[#a84f32] hover:underline"
                target="_blank"
              >
                Открыть страницу
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Надзаголовок"
                name="eyebrow"
                defaultValue={production.eyebrow}
              />
              <Field label="Заголовок" name="title" defaultValue={production.title} />
              <div className="sm:col-span-2">
                <Field label="Лид" name="lead" rows={3} defaultValue={production.lead} />
              </div>
              <Field
                label="Hero-изображение"
                name="heroImage"
                defaultValue={production.heroImage}
                hint="URL из «Галереи»"
              />
              <Field
                label="Подпись на hero"
                name="heroCaption"
                defaultValue={production.heroCaption}
              />
              <Field label="Видео 1" name="video1" defaultValue={production.video1} />
              <Field
                label="Постер видео 1"
                name="video1Poster"
                defaultValue={production.video1Poster}
              />
              <Field
                label="Подпись видео 1"
                name="video1Label"
                defaultValue={production.video1Label}
              />
              <Field label="Видео 2" name="video2" defaultValue={production.video2} />
              <Field
                label="Постер видео 2"
                name="video2Poster"
                defaultValue={production.video2Poster}
              />
              <Field
                label="Подпись видео 2"
                name="video2Label"
                defaultValue={production.video2Label}
              />
              <Field
                label="Meta title"
                name="metaTitle"
                defaultValue={production.metaTitle}
              />
              <Field
                label="Meta description"
                name="metaDescription"
                rows={2}
                defaultValue={production.metaDescription}
              />
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-serif text-xl">Этапы</h2>
            <p className="mt-1 text-sm text-[#6f675e]">
              Заполните нужные этапы. Пустые скрываются.
            </p>
            <div className="mt-4 space-y-6">
              {stages.map((stage, i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-lg border border-[#eee7dc] p-4 sm:grid-cols-2"
                >
                  <p className="sm:col-span-2 text-xs font-medium tracking-wide text-[#8a8176] uppercase">
                    Этап {i + 1}
                  </p>
                  <Field label="Номер" name={`stage_n_${i}`} defaultValue={stage.n} />
                  <Field
                    label="Название"
                    name={`stage_title_${i}`}
                    defaultValue={stage.title}
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Текст"
                      name={`stage_text_${i}`}
                      rows={3}
                      defaultValue={stage.text}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="Изображение"
                      name={`stage_image_${i}`}
                      defaultValue={stage.image}
                      hint="URL из «Галереи»"
                    />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <SubmitButton>Сохранить «Производство»</SubmitButton>
        </form>
      ) : null}

      {tab === "contacts" ? (
        <form action={savePagesAction} className="space-y-6">
          <input type="hidden" name="page" value="contacts" />
          <AdminCard>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl">Контакты</h2>
              <Link
                href="/contacts"
                className="text-sm text-[#a84f32] hover:underline"
                target="_blank"
              >
                Открыть страницу
              </Link>
            </div>
            <p className="mt-2 text-sm text-[#6f675e]">
              Телефоны, почта и мессенджеры редактируются в{" "}
              <Link href="/admin/settings" className="text-[#a84f32] hover:underline">
                Настройках сайта
              </Link>
              .
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Надзаголовок"
                name="eyebrow"
                defaultValue={contactsPage.eyebrow}
              />
              <Field
                label="Заголовок"
                name="title"
                defaultValue={contactsPage.title}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Лид"
                  name="lead"
                  rows={3}
                  defaultValue={contactsPage.lead}
                />
              </div>
              <Field
                label="Meta title"
                name="metaTitle"
                defaultValue={contactsPage.metaTitle}
              />
              <Field
                label="Meta description"
                name="metaDescription"
                rows={2}
                defaultValue={contactsPage.metaDescription}
              />
            </div>
          </AdminCard>
          <SubmitButton>Сохранить «Контакты»</SubmitButton>
        </form>
      ) : null}

      {tab === "delivery" ? (
        <form action={savePagesAction} className="space-y-6">
          <input type="hidden" name="page" value="delivery" />
          <AdminCard>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl">Доставка</h2>
              <Link
                href="/delivery"
                className="text-sm text-[#a84f32] hover:underline"
                target="_blank"
              >
                Открыть страницу
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Надзаголовок"
                name="eyebrow"
                defaultValue={deliveryPage.eyebrow}
              />
              <Field
                label="Заголовок"
                name="title"
                defaultValue={deliveryPage.title}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Лид"
                  name="lead"
                  rows={3}
                  defaultValue={deliveryPage.lead}
                />
              </div>
              <Field
                label="Заголовок: Москва и МО"
                name="localTitle"
                defaultValue={deliveryPage.localTitle}
              />
              <Field
                label="Заголовок: регионы"
                name="regionsTitle"
                defaultValue={deliveryPage.regionsTitle}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Текст: Москва и МО"
                  name="deliveryLocal"
                  rows={7}
                  defaultValue={s.contacts.deliveryLocal}
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Текст: регионы"
                  name="deliveryRegions"
                  rows={7}
                  defaultValue={s.contacts.deliveryRegions}
                />
              </div>
              <Field
                label="Meta title"
                name="metaTitle"
                defaultValue={deliveryPage.metaTitle}
              />
              <Field
                label="Meta description"
                name="metaDescription"
                rows={2}
                defaultValue={deliveryPage.metaDescription}
              />
            </div>
          </AdminCard>
          <SubmitButton>Сохранить «Доставка»</SubmitButton>
        </form>
      ) : null}
    </div>
  );
}

export default function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; tab?: string }>;
}) {
  return (
    <AdminSuspense>
      <PagesContent searchParams={searchParams} />
    </AdminSuspense>
  );
}
