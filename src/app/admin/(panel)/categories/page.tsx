import { connection } from "next/server";
import {
  deleteCategoryAction,
  saveCategoryAction,
} from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminCard,
  AdminPageHeader,
  DangerButton,
  Field,
  SubmitButton,
} from "@/components/admin/ui";
import { listCategories } from "@/lib/db/queries";

async function CategoriesContent() {
  await connection();
  const items = listCategories();

  return (
    <div>
      <AdminPageHeader
        title="Категории"
        description="Названия и превью для блока «С чего начать» и фильтров. URL изображения — из галереи."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <AdminCard className="overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#faf7f2] text-[#8a8176]">
              <tr>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Изображение</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-[#f0e9df]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-[#6f675e]">
                    {c.image || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <DangerButton>Удалить</DangerButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>

        <AdminCard>
          <h2 className="font-serif text-xl">Добавить / обновить</h2>
          <form action={saveCategoryAction} className="mt-4 space-y-3">
            <Field label="ID (опционально)" name="id" hint="Пусто = создать" />
            <Field label="Название" name="name" required />
            <Field
              label="Изображение"
              name="image"
              hint="Вставьте URL из «Галерея»"
            />
            <Field label="Порядок" name="sortOrder" type="number" defaultValue={0} />
            <SubmitButton>Сохранить</SubmitButton>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminSuspense>
      <CategoriesContent />
    </AdminSuspense>
  );
}
