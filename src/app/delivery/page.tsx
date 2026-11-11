import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Доставка — MaxiKamin",
  description:
    "Доставка каминов и гранита по Москве, МО, регионам России и странам СНГ",
};

export const instant = false;

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
  const contacts = getSettings().contacts;

  return (
    <PageShell
      eyebrow="Логистика"
      title="Доставка"
      lead="Привезём заказ своим транспортом по Москве и области или отправим в регионы через проверенные ТК."
    >
      <div className="grid max-w-3xl gap-14">
        <section>
          <h2 className="font-display text-3xl text-ash sm:text-4xl">
            Москва и Московская область
          </h2>
          <div className="mt-6">
            <Paragraphs text={contacts.deliveryLocal} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl text-ash sm:text-4xl">
            Доставка в регионы
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
