import Image from "next/image";
import PageShell from "@/components/PageShell";
import { img, videos } from "@/lib/images";

export const metadata = {
  title: "Производство — MaxiKamin",
  description:
    "Карьер и обработка гранита Елизаветинский: от добычи до готовых изделий",
};

const stages = [
  {
    n: "01",
    title: "Добыча",
    text: "Елизаветинский гранит — собственная сырьевая база. Блоки идут в дальнейшую обработку.",
    image: img.granite.quarryWide,
  },
  {
    n: "02",
    title: "Раскрой",
    text: "Слябы и заготовки для плитки, ступеней, подоконников и столешниц.",
    image: img.granite.workshopPolished,
  },
  {
    n: "03",
    title: "Склад",
    text: "Готовая брусчатка, бордюры и ступени на паллетах — под отгрузку на объект.",
    image: img.granite.warehouseSteps,
  },
  {
    n: "04",
    title: "Монтаж",
    text: "Доставка и установка каминов, топок и каменных изделий под ключ.",
    image: img.montage,
  },
];

export default function ProductionPage() {
  return (
    <PageShell
      eyebrow="Камень от карьера"
      title="Производство"
      lead="Елизаветинский гранит: карьер, цех и склад. Плитка, брусчатка, ступени, подоконники, столешницы и входные группы."
    >
      <div className="relative mb-12 aspect-[21/9] overflow-hidden bg-linen-deep sm:mb-16 sm:aspect-[2.4/1]">
        <Image
          src={img.granite.quarryAerial}
          alt="Карьер елизаветинского гранита"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-ash/40" />
        <p className="absolute bottom-6 left-6 font-display text-2xl text-cream sm:bottom-10 sm:left-10 sm:text-4xl">
          Елизаветинский гранит
        </p>
      </div>

      <div className="mb-16 grid gap-6 sm:grid-cols-2">
        <div className="overflow-hidden border border-ash/10 bg-ash">
          <video
            className="aspect-video w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={img.granite.quarryLoader}
          >
            <source src={videos.production1} type="video/mp4" />
          </video>
          <p className="px-4 py-3 text-xs tracking-wider text-cream/60 uppercase">
            Процесс · видео 1
          </p>
        </div>
        <div className="overflow-hidden border border-ash/10 bg-ash">
          <video
            className="aspect-video w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={img.granite.quarryOverview}
          >
            <source src={videos.production2} type="video/mp4" />
          </video>
          <p className="px-4 py-3 text-xs tracking-wider text-cream/60 uppercase">
            Процесс · видео 2
          </p>
        </div>
      </div>

      <div className="space-y-14">
        {stages.map((s, i) => (
          <div
            key={s.n}
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-linen-deep">
              <Image
                src={s.image}
                alt={s.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <span className="font-display text-2xl text-ember">{s.n}</span>
              <h2 className="font-display mt-2 text-3xl text-ash sm:text-4xl">
                {s.title}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-smoke">
                {s.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
