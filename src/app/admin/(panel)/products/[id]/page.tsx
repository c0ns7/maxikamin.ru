import { connection } from "next/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import AdminSuspense from "@/components/admin/AdminSuspense";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { getProduct, listBrands, listCategories } from "@/lib/db/queries";

async function EditProductContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const categories = listCategories().map((c) => c.name);
  const brands = listBrands().map((b) => b.name);

  return (
    <div>
      <AdminPageHeader title="Редактирование" description={product.name} />
      <AdminCard>
        <ProductForm
          product={product}
          categories={categories}
          brands={brands}
        />
      </AdminCard>
    </div>
  );
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AdminSuspense>
      <EditProductContent params={params} />
    </AdminSuspense>
  );
}
