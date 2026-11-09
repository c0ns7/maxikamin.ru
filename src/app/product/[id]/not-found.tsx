import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-graphite">Товар не найден</h1>
      <p className="mt-3 text-muted">
        Возможно, он был удалён или ссылка устарела.
      </p>
      <Link
        href="/catalog"
        className="mt-8 rounded-2xl bg-amber px-6 py-3 text-sm font-semibold text-cream hover:bg-amber-hover"
      >
        Вернуться в каталог
      </Link>
    </div>
  );
}
