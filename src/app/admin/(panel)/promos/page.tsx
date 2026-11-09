import { connection } from "next/server";
import { deletePromoAction, savePromoAction } from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminCard,
  AdminPageHeader,
  Checkbox,
  DangerButton,
  Field,
  SubmitButton,
} from "@/components/admin/ui";
import { listPromos } from "@/lib/db/queries";

async function PromosContent() {
  await connection();
  const items = listPromos(true);

  return (
    <div>
      <AdminPageHeader
        title="Акции"
        description="Спецпредложения на странице /promo. Картинку берите из галереи."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          {items.map((p) => (
            <AdminCard key={p.id}>
              <p className="text-xs tracking-[0.16em] text-[#a84f32] uppercase">
                {p.until}
              </p>
              <h3 className="mt-1 font-serif text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-[#6f675e]">{p.text}</p>
              <div className="mt-4 flex justify-end">
                <form action={deletePromoAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <DangerButton>Удалить</DangerButton>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>

        <AdminCard>
          <h2 className="font-serif text-xl">Новая акция</h2>
          <form action={savePromoAction} className="mt-4 space-y-3">
            <Field label="Заголовок" name="title" required />
            <Field label="Текст" name="text" rows={4} required />
            <Field label="Срок" name="until" placeholder="до 31 марта" />
            <Field
              label="Изображение"
              name="image"
              hint="URL из раздела «Галерея»"
            />
            <Field label="Порядок" name="sortOrder" type="number" defaultValue={0} />
            <Checkbox label="Активна" name="active" defaultChecked />
            <SubmitButton>Сохранить</SubmitButton>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}

export default function AdminPromosPage() {
  return (
    <AdminSuspense>
      <PromosContent />
    </AdminSuspense>
  );
}
