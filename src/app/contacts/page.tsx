import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import { contactPhones, telHref } from "@/lib/contacts";
import { getSettings } from "@/lib/db/queries";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const page = getSettings().pages.contacts;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

async function ContactsContent() {
  await connection();
  const settings = getSettings();
  const contacts = settings.contacts;
  const page = settings.pages.contacts;
  const phones = contactPhones(contacts);
  const socials = [
    { label: "MAX", href: contacts.socialMax },
    { label: "Telegram", href: contacts.socialTelegram },
    { label: "WhatsApp", href: contacts.socialWhatsapp },
  ].filter((s) => s.href.trim());

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
      <div className="grid gap-12 lg:grid-cols-3">
        <section>
          <h2 className="text-[11px] font-medium tracking-[0.2em] text-ember uppercase">
            Телефоны
          </h2>
          <ul className="mt-4 space-y-3">
            {phones.map((phone) => (
              <li key={phone}>
                <a
                  href={telHref(phone)}
                  className="font-display text-2xl text-ash transition hover:text-ember sm:text-3xl"
                >
                  {phone}
                </a>
              </li>
            ))}
          </ul>
          {socials.length ? (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-smoke">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline hover:text-ash"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section>
          <h2 className="text-[11px] font-medium tracking-[0.2em] text-ember uppercase">
            Время работы
          </h2>
          <p className="font-display mt-4 text-3xl text-ash">{contacts.hours}</p>
          {contacts.hoursNote ? (
            <p className="mt-2 text-sm text-smoke">{contacts.hoursNote}</p>
          ) : null}
        </section>

        <section>
          <h2 className="text-[11px] font-medium tracking-[0.2em] text-ember uppercase">
            Почта
          </h2>
          <a
            href={`mailto:${contacts.email}`}
            className="mt-4 inline-block text-lg text-ash transition hover:text-ember"
          >
            {contacts.email}
          </a>
          {contacts.address ? (
            <p className="mt-6 text-sm text-smoke">{contacts.address}</p>
          ) : null}
          {contacts.site ? (
            <p className="mt-2 text-sm text-smoke">{contacts.site}</p>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
}

export default function ContactsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-smoke">
          Загрузка…
        </div>
      }
    >
      <ContactsContent />
    </Suspense>
  );
}
