import Image from "next/image";
import PageShell from "@/components/PageShell";
import { img } from "@/lib/images";
import { brandAssortment, brands } from "@/lib/data";

export const metadata = {
  title: "О нас — Maxi-Kamin",
  description:
    "Maxi-Kamin — камины, топки, печи и изделия из гранита Елизаветинский",
};

const facts = [
  { n: "15", label: "брендов в шоуруме" },
  { n: "1", label: "карьер гранита" },
  { n: "под ключ", label: "доставка и монтаж" },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Maxi-Kamin"
      title="О нас"
      lead="Камины, топки, печи европейских и российских брендов — и изделия из елизаветинского гранита от карьера до объекта."
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden bg-linen-deep lg:min-h-[520px] lg:aspect-auto">
          <Image
            src={img.granite.quarryLoader}
            alt="Карьер гранита"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[15px] leading-relaxed text-smoke">
            Maxi-Kamin — шоурум и поставка: Madeira, Экокамин, Kratki, ABX,
            IldNord, FireBird, La Nordica, Solzaima, MCZ, AVES, Schmid, Brunner,
            Hoxter и дымоходы Феникс. Отдельно — изделия из гранита
            Елизаветинский: плитка, брусчатка, подоконники, ступени, столешницы
            и уличные входные группы.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-smoke">
            Подбираем решение под архитектуру, считаем тепловую нагрузку,
            комплектуем дымоход и облицовку, доставляем и монтируем.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-ash/10 pt-10">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="font-display text-2xl text-ember sm:text-3xl">
                  {f.n}
                </p>
                <p className="mt-1 text-xs text-smoke">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-20 border-t border-ash/10 pt-14">
        <h2 className="font-display text-3xl text-ash sm:text-4xl">
          Бренды и направления
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div
              key={brand}
              className="border border-ash/10 bg-paper p-5"
            >
              <h3 className="font-display text-xl text-ash">{brand}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-smoke">
                {brandAssortment[brand].map((line) => (
                  <li key={line}>— {line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
