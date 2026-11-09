import { Suspense } from "react";
import { connection } from "next/server";
import PageShell from "@/components/PageShell";
import { listReviews } from "@/lib/db/queries";

export const instant = false;

export const metadata = {
  title: "Отзывы — Maxi-Kamin",
  description: "Отзывы клиентов о каминах, камне и монтаже",
};

async function ReviewsContent() {
  await connection();
  const reviews = listReviews();

  return (
    <PageShell
      eyebrow="Клиенты"
      title="Отзывы"
      lead="Живые впечатления тех, кто уже греется у нашего очага или живёт с камнем в интерьере."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {reviews.map((r) => (
          <blockquote
            key={r.id}
            className="border border-ash/10 bg-paper p-6 sm:p-8"
          >
            <p className="font-display text-xl leading-snug text-ash sm:text-2xl">
              «{r.text}»
            </p>
            <footer className="mt-6 border-t border-ash/10 pt-4">
              <cite className="not-italic">
                <span className="block text-sm font-medium text-ash">
                  {r.name}
                </span>
                <span className="mt-0.5 block text-xs text-smoke">
                  {r.place}
                </span>
              </cite>
            </footer>
          </blockquote>
        ))}
      </div>
    </PageShell>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-smoke">Загрузка…</div>}>
      <ReviewsContent />
    </Suspense>
  );
}
