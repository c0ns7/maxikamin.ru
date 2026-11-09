import { connection } from "next/server";
import {
  deletePortfolioAction,
  savePortfolioAction,
} from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminCard,
  AdminPageHeader,
  Checkbox,
  DangerButton,
  Field,
  SubmitButton,
} from "@/components/admin/ui";
import { listPortfolio } from "@/lib/db/queries";

async function PortfolioContent() {
  await connection();
  const items = listPortfolio(true);

  return (
    <div>
      <AdminPageHeader
        title="Портфолио"
        description="Галерея на странице /portfolio."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((p) => (
            <AdminCard key={p.id}>
              <p className="font-medium">{p.title}</p>
              <p className="mt-1 text-xs text-[#8a8176]">{p.place}</p>
              <p className="mt-2 truncate text-xs text-[#6f675e]">{p.image}</p>
              <form action={deletePortfolioAction} className="mt-3">
                <input type="hidden" name="id" value={p.id} />
                <DangerButton>Удалить</DangerButton>
              </form>
            </AdminCard>
          ))}
        </div>

        <AdminCard>
          <h2 className="font-serif text-xl">Новый кадр</h2>
          <form action={savePortfolioAction} className="mt-4 space-y-3">
            <Field label="Заголовок" name="title" required />
            <Field label="Подпись" name="place" />
            <Field
              label="Изображение"
              name="image"
              required
              hint="URL из раздела «Галерея»"
            />
            <Field label="Порядок" name="sortOrder" type="number" defaultValue={0} />
            <Checkbox label="Активен" name="active" defaultChecked />
            <SubmitButton>Сохранить</SubmitButton>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}

export default function AdminPortfolioPage() {
  return (
    <AdminSuspense>
      <PortfolioContent />
    </AdminSuspense>
  );
}
