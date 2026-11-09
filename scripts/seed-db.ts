import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import {
  brands as seedBrandNames,
  brandAssortment,
  categories as seedCategoryNames,
  categoryImages,
  products as seedProducts,
} from "../src/lib/data";
import * as schema from "../src/lib/db/schema";
import { defaultSettings } from "../src/lib/db/defaults";
import { img } from "../src/lib/images";

const dbPath = path.join(process.cwd(), "data", "maxi-kamin.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    specs TEXT,
    line TEXT,
    featured INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    assortment TEXT NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    place TEXT NOT NULL DEFAULT '',
    text TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS promos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    until TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS portfolio_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    place TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS media_files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL,
    mime TEXT NOT NULL DEFAULT 'image/jpeg',
    size INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const db = drizzle(sqlite, { schema });

const force = process.argv.includes("--force");
const existing = sqlite.prepare("SELECT COUNT(*) as c FROM products").get() as {
  c: number;
};

if (existing.c > 0 && !force) {
  console.log(
    `DB already has ${existing.c} products. Use --force to reseed.`,
  );
  process.exit(0);
}

if (force) {
  sqlite.exec(`
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM brands;
    DELETE FROM reviews;
    DELETE FROM promos;
    DELETE FROM portfolio_items;
    DELETE FROM settings;
  `);
}

const featuredNames = new Set(defaultSettings.featuredProductIds);

for (const [i, name] of seedCategoryNames.entries()) {
  db.insert(schema.categories)
    .values({
      id: String(i + 1),
      name,
      image: categoryImages[name as keyof typeof categoryImages] ?? "",
      sortOrder: i,
    })
    .run();
}

for (const [i, name] of seedBrandNames.entries()) {
  db.insert(schema.brands)
    .values({
      id: String(i + 1),
      name,
      assortment: brandAssortment[name] ?? [],
      sortOrder: i,
    })
    .run();
}

for (const [i, p] of seedProducts.entries()) {
  db.insert(schema.products)
    .values({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      image: p.image,
      description: p.description,
      specs: p.specs ?? null,
      line: p.line ?? null,
      featured: featuredNames.has(p.name),
      active: true,
      sortOrder: i,
    })
    .run();
}

const reviewSeed = [
  {
    id: "r1",
    name: "Анна К.",
    place: "Москва",
    text: "Заказывали топку Kratki и облицовку Madeira. Монтаж аккуратный, всё объяснили по розжигу. В гостиной наконец появился «живой» огонь.",
  },
  {
    id: "r2",
    name: "Игорь В.",
    place: "МО, Истра",
    text: "Столешница из елизаветинского гранита — ровно в размер, фаски чистые. Сроки соблюли, доставка без сюрпризов.",
  },
  {
    id: "r3",
    name: "Мария и Сергей",
    place: "Тула",
    text: "Печь La Nordica для дачи. Помогли с дымоходом и выездом мастера в регион. Рекомендуем.",
  },
  {
    id: "r4",
    name: "Дмитрий Л.",
    place: "Санкт-Петербург",
    text: "Честный расчёт в калькуляторе почти совпал с итоговой сметой после замера. Прозрачно и по делу.",
  },
  {
    id: "r5",
    name: "Елена Р.",
    place: "Казань",
    text: "Брусчатка и ступени Елизаветинский — заказывали удалённо по фото. Качество камня отличное, упаковка надёжная.",
  },
  {
    id: "r6",
    name: "Павел Н.",
    place: "Москва",
    text: "Демонтировали старый портал и поставили каминокомплект ABX. Работали чисто, оставили инструкцию по уходу.",
  },
];

reviewSeed.forEach((r, i) => {
  db.insert(schema.reviews)
    .values({ ...r, active: true, sortOrder: i })
    .run();
});

const promoSeed = [
  {
    id: "p1",
    title: "Монтаж в подарок",
    text: "При покупке топки Kratki или ABX — монтаж базовой комплектации без доплаты.",
    until: "до 31 марта",
    image: img.hero,
  },
  {
    id: "p2",
    title: "−15% на гранит",
    text: "Скидка на столешницы и подоконники из елизаветинского гранита при заказе от 2 м².",
    until: "до 15 апреля",
    image: img.granite.slabPolished,
  },
  {
    id: "p3",
    title: "Комплект «Очаг»",
    text: "Топка + дымоход + доставка по Москве со скидкой 10% на комплект.",
    until: "бессрочно",
    image: img.granite.quarryWide,
  },
];

promoSeed.forEach((p, i) => {
  db.insert(schema.promos)
    .values({ ...p, active: true, sortOrder: i })
    .run();
});

const portfolioSeed = [
  {
    id: "pf1",
    title: "Карьер",
    place: "Добыча елизаветинского гранита",
    image: img.granite.quarryWide,
  },
  {
    id: "pf2",
    title: "Погрузка блоков",
    place: "Карьер · техника",
    image: img.granite.quarryLoader,
  },
  {
    id: "pf3",
    title: "Полированный сляб",
    place: "Цех · столешницы и плитка",
    image: img.granite.slabPolished,
  },
  {
    id: "pf4",
    title: "Брусчатка",
    place: "Колотая фактура",
    image: img.granite.paverCloseup,
  },
  {
    id: "pf5",
    title: "Ступени на складе",
    place: "Готово к отгрузке",
    image: img.granite.warehouseSteps,
  },
  {
    id: "pf6",
    title: "Бордюры и курдюки",
    place: "Уличные входные группы",
    image: img.granite.yardCurbs,
  },
  {
    id: "pf7",
    title: "Фактура камня",
    place: "Колотый и гладкий",
    image: img.granite.textureSample,
  },
  {
    id: "pf8",
    title: "Образец плитки",
    place: "Елизаветинский гранит",
    image: img.granite.tileSample,
  },
  {
    id: "pf9",
    title: "Слябы в цехе",
    place: "Подготовка к раскрою",
    image: img.granite.workshopRack,
  },
];

portfolioSeed.forEach((p, i) => {
  db.insert(schema.portfolioItems)
    .values({ ...p, active: true, sortOrder: i })
    .run();
});

const featuredIds = seedProducts
  .filter((p) => featuredNames.has(p.name))
  .map((p) => p.id);

const siteSettings = {
  ...defaultSettings,
  featuredProductIds: featuredIds,
};

const existingSettings = db
  .select()
  .from(schema.settings)
  .where(eq(schema.settings.key, "site"))
  .get();

if (existingSettings) {
  db.update(schema.settings)
    .set({ value: siteSettings })
    .where(eq(schema.settings.key, "site"))
    .run();
} else {
  db.insert(schema.settings)
    .values({ key: "site", value: siteSettings })
    .run();
}

console.log(
  `Seeded ${seedProducts.length} products, ${seedCategoryNames.length} categories, ${seedBrandNames.length} brands.`,
);
sqlite.close();
