import Link from "next/link";
import { connection } from "next/server";
import { uploadMediaAction } from "@/app/admin/actions";
import AdminSuspense from "@/components/admin/AdminSuspense";
import MediaItemCard from "@/components/admin/MediaItemCard";
import {
  AdminCard,
  AdminPageHeader,
  SubmitButton,
} from "@/components/admin/ui";
import { listMedia, mediaFolders } from "@/lib/db/media";

async function MediaContent({
  searchParams,
}: {
  searchParams: Promise<{
    uploaded?: string;
    error?: string;
    q?: string;
    folder?: string;
    replaced?: string;
    deleted?: string;
  }>;
}) {
  await connection();
  const { uploaded, error, q, folder, replaced, deleted } =
    (await searchParams) ?? {};
  const items = listMedia({ q, folder });
  const folders = mediaFolders();

  return (
    <div>
      <AdminPageHeader
        title="Галерея"
        description={`${items.length} изображений. Можно заменить файл по той же ссылке или удалить.`}
      />

      {uploaded ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Файлы загружены. Скопируйте нужную ссылку ниже.
        </p>
      ) : null}
      {replaced ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Картинка обновлена — ссылка не изменилась.
        </p>
      ) : null}
      {deleted ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Файл удалён.
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {decodeURIComponent(error)}
        </p>
      ) : null}

      <AdminCard className="mb-6">
        <h2 className="font-serif text-xl">Загрузить новые</h2>
        <form action={uploadMediaAction} className="mt-4 space-y-4">
          <input
            type="file"
            name="files"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple
            required
            className="block w-full text-sm text-[#6f675e] file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#1a1714] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#a84f32]"
          />
          <p className="text-xs text-[#8a8176]">
            JPG, PNG, WEBP, GIF, SVG · до 12 МБ · сохраняются в /uploads/gallery/
          </p>
          <SubmitButton>Загрузить</SubmitButton>
        </form>
      </AdminCard>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <form className="flex flex-wrap gap-2">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Поиск: madeira, balt-04, elizavetinsky…"
            className="min-w-[240px] flex-1 rounded-md border border-[#ddd6cb] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a84f32]"
          />
          {folder ? <input type="hidden" name="folder" value={folder} /> : null}
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-[#1a1714] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a84f32]"
          >
            Найти
          </button>
          {(q || folder) && (
            <Link
              href="/admin/media"
              className="inline-flex items-center rounded-md border border-[#ddd6cb] bg-white px-4 py-2.5 text-sm"
            >
              Сбросить
            </Link>
          )}
        </form>
        <p className="text-xs text-[#8a8176]">Показано: {items.length}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={q ? `/admin/media?q=${encodeURIComponent(q)}` : "/admin/media"}
          className={`rounded-full px-3 py-1.5 text-xs ${
            !folder
              ? "bg-[#1a1714] text-white"
              : "bg-white text-[#6f675e] ring-1 ring-[#ddd6cb]"
          }`}
        >
          Все
        </Link>
        {folders.map((f) => {
          const href = q
            ? `/admin/media?folder=${encodeURIComponent(f.folder)}&q=${encodeURIComponent(q)}`
            : `/admin/media?folder=${encodeURIComponent(f.folder)}`;
          return (
            <Link
              key={f.folder}
              href={href}
              className={`rounded-full px-3 py-1.5 text-xs ${
                folder === f.folder
                  ? "bg-[#1a1714] text-white"
                  : "bg-white text-[#6f675e] ring-1 ring-[#ddd6cb]"
              }`}
              title={f.folder}
            >
              {f.folder.replace(/^\/images\/catalog\//, "").replace(/^\//, "")}{" "}
              · {f.count}
            </Link>
          );
        })}
      </div>

      {items.length === 0 ? (
        <AdminCard>
          <p className="text-sm text-[#6f675e]">Ничего не найдено.</p>
        </AdminCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <MediaItemCard
              key={item.id}
              item={{
                id: item.id,
                url: item.url,
                originalName: item.originalName,
                size: item.size,
              }}
              folder={folder}
              q={q}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{
    uploaded?: string;
    error?: string;
    q?: string;
    folder?: string;
    replaced?: string;
    deleted?: string;
  }>;
}) {
  return (
    <AdminSuspense>
      <MediaContent searchParams={searchParams} />
    </AdminSuspense>
  );
}
