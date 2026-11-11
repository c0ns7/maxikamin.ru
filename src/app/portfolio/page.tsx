import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import PageShell from "@/components/PageShell";
import { listPortfolio } from "@/lib/db/queries";

export const instant = false;

export const metadata = {
  title: "Портфолио — MaxiKamin",
  description: "Карьер, цех и изделия из елизаветинского гранита",
};

async function PortfolioContent() {
  await connection();
  const projects = listPortfolio();

  return (
    <PageShell
      eyebrow="Работы"
      title="Портфолио"
      lead="От карьера до готовых изделий — как выглядит елизаветинский гранит в деле."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <figure
            key={project.id}
            className="group relative aspect-[4/5] overflow-hidden bg-linen-deep"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ash/85 to-transparent p-5 pt-16 text-cream">
              <p className="font-display text-xl">{project.title}</p>
              <p className="mt-1 text-sm text-cream/65">{project.place}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </PageShell>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-smoke">Загрузка…</div>}>
      <PortfolioContent />
    </Suspense>
  );
}
