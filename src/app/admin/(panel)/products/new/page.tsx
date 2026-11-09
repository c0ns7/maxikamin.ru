import { connection } from "next/server";
import ProductForm from "@/components/admin/ProductForm";
import AdminSuspense from "@/components/admin/AdminSuspense";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { listBrands, listCategories } from "@/lib/db/queries";

async function NewProductContent() {
  await connection();
  const categories = listCategories().map((c) => c.name);
  const brands = listBrands().map((b) => b.name);

  return (
    <div>
      <AdminPageHeader
        title="Новый товар"
        description="Добавьте позицию в каталог. URL картинки можно скопировать из раздела «Галерея»."
      />
      <AdminCard>
        <ProductForm categories={categories} brands={brands} />
      </AdminCard>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <AdminSuspense>
      <NewProductContent />
    </AdminSuspense>
  );
}
