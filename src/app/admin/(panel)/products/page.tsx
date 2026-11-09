import Link from "next/link";
import { connection } from "next/server";
import { formatPrice } from "@/lib/data";
import { listProducts } from "@/lib/db/queries";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  EmptyState,
} from "@/components/admin/ui";

async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await connection();
  const { q } = (await searchParams) ?? {};
  const products = listProducts({ includeInactive: true, q });

  return (
    <div>
      <AdminPageHeader
        title="Каталог"
        description={`${products.length} позиций. Редактирование сразу отражается на сайте.`}
        action={<AdminButton href="/admin/products/new">Новый товар</AdminButton>}
      />

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Поиск по названию…"
          className="w-full max-w-md rounded-md border border-[#ddd6cb] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a84f32]"
        />
      </form>

      {products.length === 0 ? (
        <EmptyState text="Товаров пока нет. Добавьте первую позицию." />
      ) : (
        <AdminCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-[#faf7f2] text-[#8a8176]">
                <tr>
                  <th className="px-4 py-3 font-medium">Товар</th>
                  <th className="px-4 py-3 font-medium">Бренд</th>
                  <th className="px-4 py-3 font-medium">Категория</th>
                  <th className="px-4 py-3 font-medium">Цена</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-[#f0e9df]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="font-medium hover:text-[#a84f32]"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-[#8a8176]">#{p.id}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6f675e]">{p.brand}</td>
                    <td className="px-4 py-3 text-[#6f675e]">{p.category}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          p.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {p.active ? "Активен" : "Скрыт"}
                        {p.featured ? " · featured" : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </div>
  );
}

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <AdminSuspense>
      <ProductsContent searchParams={searchParams} />
    </AdminSuspense>
  );
}
