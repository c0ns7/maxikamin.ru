import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/data";
import {
  getProduct,
  getRelatedProducts,
  getSettings,
} from "@/lib/db/queries";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";

export const instant = false;

const reassurances = [
  "Официальная поставка бренда",
  "Помощь с подбором мощности и дымохода",
  "Доставка и монтаж по запросу",
];

async function ProductContent({ id }: { id: string }) {
  await connection();
  const product = getProduct(id);
  if (!product || product.active === false) notFound();

  const related = getRelatedProducts(product);
  const phone = getSettings().contacts.phone;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-28 sm:px-8 lg:px-10 lg:pt-32">
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-smoke">
        <Link href="/" className="hover:text-ember">
          Главная
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/catalog" className="hover:text-ember">
          Каталог
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/catalog?category=${encodeURIComponent(product.category)}`}
          className="hover:text-ember"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="line-clamp-1 text-ash">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden bg-linen-deep lg:sticky lg:top-28 lg:self-start">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col lg:pt-2">
          <p className="text-[11px] font-medium tracking-[0.16em] text-ember uppercase">
            {product.brand} · {product.category}
          </p>
          <h1 className="font-display mt-3 text-3xl leading-tight text-ash sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 font-display text-3xl text-ash tabular-nums sm:text-4xl">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-sm text-smoke">
            Цена ориентировочная. Точную смету уточним после замера.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-smoke">
            {product.description}
          </p>

          <ul className="mt-8 space-y-2.5 border-y border-line py-6">
            {reassurances.map((line) => (
              <li key={line} className="flex gap-3 text-sm text-ash">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ProductActions product={product} phone={phone} />
          </div>
        </div>
      </div>

      {product.specs && (
        <section className="mt-16 sm:mt-24">
          <h2 className="font-display text-3xl text-ash">Характеристики</h2>
          <div className="mt-6 border-y border-line">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key} className="border-b border-line last:border-0">
                    <th className="w-1/2 px-0 py-4 text-left font-medium text-smoke sm:w-2/5">
                      {key}
                    </th>
                    <td className="px-0 py-4 text-ash">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-ash">С этим смотрят</h2>
            <Link
              href={`/catalog?category=${encodeURIComponent(product.category)}`}
              className="text-[12px] tracking-[0.12em] text-smoke uppercase hover:text-ash"
            >
              Вся категория
            </Link>
          </div>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1400px] px-5 py-28 text-smoke">
          Загрузка товара…
        </div>
      }
    >
      <ProductContent id={id} />
    </Suspense>
  );
}
