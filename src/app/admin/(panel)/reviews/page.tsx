import { connection } from "next/server";
import { deleteReviewAction, saveReviewAction } from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import {
  AdminCard,
  AdminPageHeader,
  Checkbox,
  DangerButton,
  Field,
  SubmitButton,
} from "@/components/admin/ui";
import { listReviews } from "@/lib/db/queries";

async function ReviewsContent() {
  await connection();
  const items = listReviews(true);

  return (
    <div>
      <AdminPageHeader
        title="Отзывы"
        description="Публикуются на странице /reviews."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          {items.map((r) => (
            <AdminCard key={r.id}>
              <p className="font-serif text-lg leading-snug">«{r.text}»</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-[#8a8176]">{r.place}</p>
                </div>
                <form action={deleteReviewAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <DangerButton>Удалить</DangerButton>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>

        <AdminCard>
          <h2 className="font-serif text-xl">Новый отзыв</h2>
          <form action={saveReviewAction} className="mt-4 space-y-3">
            <Field label="Имя" name="name" required />
            <Field label="Город / место" name="place" />
            <Field label="Текст" name="text" rows={5} required />
            <Field label="Порядок" name="sortOrder" type="number" defaultValue={0} />
            <Checkbox label="Активен" name="active" defaultChecked />
            <SubmitButton>Сохранить</SubmitButton>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <AdminSuspense>
      <ReviewsContent />
    </AdminSuspense>
  );
}
