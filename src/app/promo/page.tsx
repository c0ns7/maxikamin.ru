import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import PageShell from "@/components/PageShell";
import { listPromos } from "@/lib/db/queries";

export const instant = false;

export const metadata = {
  title: "Акции — MaxiKamin",
  description: "Специальные предложения на камины, топки и изделия из камня",
};

async function PromoContent() {
  await connection();
  const promos = listPromos();

  return (
    <PageShell
      eyebrow="Предложения"
      title="Акции"
      lead="Актуальные спецпредложения на оборудование и камень. Условия уточняйте у менеджера."
    >
      <div className="space-y-10">
        {promos.map((p, i) => (
          <article
            key={p.id}
            className={`grid items-center gap-8 border-b border-ash/10 pb-10 lg:grid-cols-2 lg:gap-14 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-linen-deep">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : null}
            </div>
            <div>
              <span className="text-[11px] tracking-[0.2em] text-ember uppercase">
                {p.until}
              </span>
              <h2 className="font-display mt-2 text-3xl text-ash sm:text-4xl">
                {p.title}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-smoke">
                {p.text}
              </p>
              <Link
                href="/catalog"
                className="mt-8 inline-flex border-b border-ash pb-1 text-[12px] tracking-[0.16em] uppercase transition hover:border-ember hover:text-ember"
              >
                Смотреть каталог →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export default function PromoPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-smoke">Загрузка…</div>}>
      <PromoContent />
    </Suspense>
  );
}
