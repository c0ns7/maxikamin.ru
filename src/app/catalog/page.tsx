import { Suspense } from "react";
import { connection } from "next/server";
import CatalogClient from "@/components/CatalogClient";
import {
  getSettings,
  listBrands,
  listCategories,
  listProducts,
} from "@/lib/db/queries";

export const instant = false;

export const metadata = {
  title: "Каталог — MaxiKamin",
  description:
    "Каталог MaxiKamin: облицовки Madeira, топки, печи, биокамины, гранит Елизаветинский и дымоходы",
};

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">
      Загрузка каталога…
    </div>
  );
}

async function CatalogData() {
  await connection();
  const products = listProducts();
  const categories = listCategories().map((c) => c.name);
  const brands = listBrands().map((b) => b.name);
  const settings = getSettings();

  return (
    <CatalogClient
      products={products}
      categories={categories}
      brands={brands}
      phone={settings.contacts.phone}
    />
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogData />
    </Suspense>
  );
}
