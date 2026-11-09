import Link from "next/link";
import {
  deleteProductAction,
  saveProductAction,
} from "@/app/admin/actions";
import type { Product } from "@/lib/types";
import {
  Checkbox,
  DangerButton,
  Field,
  SubmitButton,
} from "@/components/admin/ui";

export default function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: Product;
  categories: string[];
  brands: string[];
}) {
  const specsDefault = product?.specs
    ? Object.entries(product.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    : "";

  return (
    <div className="space-y-5">
      <form action={saveProductAction} className="space-y-5">
        {product ? <input type="hidden" name="id" value={product.id} /> : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Название"
            name="name"
            required
            defaultValue={product?.name}
          />
          <Field
            label="Цена, ₽"
            name="price"
            type="number"
            required
            defaultValue={product?.price}
          />
          <label className="block text-sm">
            <span className="font-medium">Категория</span>
            <select
              name="category"
              required
              defaultValue={product?.category}
              className="mt-1.5 w-full rounded-md border border-[#ddd6cb] bg-[#fbfaf8] px-3 py-2.5 text-sm outline-none focus:border-[#a84f32]"
            >
              <option value="">Выберите…</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Бренд</span>
            <select
              name="brand"
              required
              defaultValue={product?.brand}
              className="mt-1.5 w-full rounded-md border border-[#ddd6cb] bg-[#fbfaf8] px-3 py-2.5 text-sm outline-none focus:border-[#a84f32]"
            >
              <option value="">Выберите…</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <div>
            <Field
              label="Изображение (URL)"
              name="image"
              required
              defaultValue={product?.image ?? "/images/hero.png"}
              hint="Вставьте ссылку из галереи или путь вида /images/..."
            />
            <Link
              href="/admin/media"
              className="mt-1.5 inline-block text-xs text-[#a84f32] hover:underline"
            >
              Открыть галерею →
            </Link>
          </div>
          <Field
            label="Линейка"
            name="line"
            defaultValue={product?.line}
            placeholder="Каминный портал"
          />
          <Field
            label="Порядок сортировки"
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
          />
        </div>

        <Field
          label="Описание"
          name="description"
          rows={4}
          defaultValue={product?.description}
        />
        <Field
          label="Характеристики"
          name="specs"
          rows={6}
          defaultValue={specsDefault}
          hint="По одной на строку: Ключ: Значение"
        />

        <div className="flex flex-wrap gap-6">
          <Checkbox
            label="Показывать на сайте"
            name="active"
            defaultChecked={product?.active !== false}
          />
          <Checkbox
            label="В блоке «Популярное»"
            name="featured"
            defaultChecked={Boolean(product?.featured)}
          />
        </div>

        <div className="border-t border-[#eee7dc] pt-5">
          <SubmitButton>{product ? "Сохранить" : "Создать товар"}</SubmitButton>
        </div>
      </form>

      {product ? (
        <form action={deleteProductAction}>
          <input type="hidden" name="id" value={product.id} />
          <DangerButton>Удалить товар</DangerButton>
        </form>
      ) : null}
    </div>
  );
}
