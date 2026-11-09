import { connection } from "next/server";
import { deleteBrandAction, saveBrandAction } from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminCard,
  AdminPageHeader,
  DangerButton,
  Field,
  SubmitButton,
} from "@/components/admin/ui";
import { listBrands } from "@/lib/db/queries";

async function BrandsContent() {
  await connection();
  const items = listBrands();

  return (
    <div>
      <AdminPageHeader
        title="Бренды"
        description="Бренды в фильтрах каталога и на главной."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <AdminCard className="space-y-4">
          {items.map((b) => (
            <div
              key={b.id}
              className="flex items-start justify-between gap-4 border-b border-[#f0e9df] pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="mt-1 text-xs text-[#8a8176]">
                  {(b.assortment ?? []).join(" · ") || "Без линейки"}
                </p>
              </div>
              <form action={deleteBrandAction}>
                <input type="hidden" name="id" value={b.id} />
                <DangerButton>Удалить</DangerButton>
              </form>
            </div>
          ))}
        </AdminCard>

        <AdminCard>
          <h2 className="font-serif text-xl">Добавить / обновить</h2>
          <form action={saveBrandAction} className="mt-4 space-y-3">
            <Field label="ID (опционально)" name="id" />
            <Field label="Название" name="name" required />
            <Field
              label="Ассортимент"
              name="assortment"
              rows={5}
              hint="По одной линейке на строку"
            />
            <Field label="Порядок" name="sortOrder" type="number" defaultValue={0} />
            <SubmitButton>Сохранить</SubmitButton>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}

export default function AdminBrandsPage() {
  return (
    <AdminSuspense>
      <BrandsContent />
    </AdminSuspense>
  );
}
