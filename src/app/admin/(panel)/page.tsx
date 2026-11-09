import Link from "next/link";
import { connection } from "next/server";
import { formatPrice } from "@/lib/data";
import { getDashboardStats } from "@/lib/db/queries";
import AdminSuspense from "@/components/admin/AdminSuspense";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

async function DashboardContent() {
  await connection();
  const stats = getDashboardStats();

  const cards = [
    { label: "Товаров", value: stats.productCount },
    { label: "Активных", value: stats.activeCount },
    { label: "Брендов", value: stats.brandCount },
    { label: "Отзывов", value: stats.reviewCount },
    { label: "Акций", value: stats.promoCount },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Обзор"
        description="Управляйте каталогом и контентом сайта из одной панели."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex rounded-md bg-[#a84f32] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#8f4229]"
          >
            Добавить товар
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <AdminCard key={c.label}>
            <p className="text-xs tracking-[0.16em] text-[#8a8176] uppercase">
              {c.label}
            </p>
            <p className="mt-2 font-serif text-3xl">{c.value}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">Недавние правки каталога</h2>
          <Link href="/admin/products" className="text-sm text-[#a84f32]">
            Весь каталог
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#eee7dc] text-[#8a8176]">
              <tr>
                <th className="pb-2 font-medium">Название</th>
                <th className="pb-2 font-medium">Бренд</th>
                <th className="pb-2 font-medium">Категория</th>
                <th className="pb-2 font-medium">Цена</th>
              </tr>
            </thead>
            <tbody>
              {stats.latest.map((p) => (
                <tr key={p.id} className="border-b border-[#f2ebe1]">
                  <td className="py-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-medium hover:text-[#a84f32]"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 text-[#6f675e]">{p.brand}</td>
                  <td className="py-3 text-[#6f675e]">{p.category}</td>
                  <td className="py-3">{formatPrice(p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminSuspense>
      <DashboardContent />
    </AdminSuspense>
  );
}
