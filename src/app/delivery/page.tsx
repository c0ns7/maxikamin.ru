import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/db/queries";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const page = getSettings().pages.delivery;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-smoke">
      {text
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
    </div>
  );
}

async function DeliveryContent() {
  await connection();
  const settings = getSettings();
  const contacts = settings.contacts;
  const page = settings.pages.delivery;

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
      <div className="grid max-w-3xl gap-14">
        <section>
          <h2 className="font-display text-3xl text-ash sm:text-4xl">
            {page.localTitle}
          </h2>
          <div className="mt-6">
            <Paragraphs text={contacts.deliveryLocal} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl text-ash sm:text-4xl">
            {page.regionsTitle}
          </h2>
          <div className="mt-6">
            <Paragraphs text={contacts.deliveryRegions} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-smoke">
          Загрузка…
        </div>
      }
    >
      <DeliveryContent />
    </Suspense>
  );
}
