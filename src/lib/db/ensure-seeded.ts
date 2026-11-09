import { eq } from "drizzle-orm";
import {
  brands as seedBrandNames,
  brandAssortment,
  categories as seedCategoryNames,
  categoryImages,
  products as seedProducts,
} from "@/lib/data";
import { img } from "@/lib/images";
import { getDb, isDatabaseSeeded } from "./client";
import { defaultSettings } from "./defaults";
import * as schema from "./schema";

let attempted = false;

/** Lazily seed SQLite on first read if the DB is empty. */
export function ensureSeeded() {
  if (attempted) return;
  attempted = true;
  if (isDatabaseSeeded()) return;

  const db = getDb();
  const featuredNames = new Set(defaultSettings.featuredProductIds);

  seedCategoryNames.forEach((name, i) => {
    db.insert(schema.categories)
      .values({
        id: String(i + 1),
        name,
        image: categoryImages[name as keyof typeof categoryImages] ?? "",
        sortOrder: i,
      })
      .run();
  });

  seedBrandNames.forEach((name, i) => {
    db.insert(schema.brands)
      .values({
        id: String(i + 1),
        name,
        assortment: brandAssortment[name] ?? [],
        sortOrder: i,
      })
      .run();
  });

  seedProducts.forEach((p, i) => {
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
  });

  const reviews = [
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
  reviews.forEach((r, i) => {
    db.insert(schema.reviews)
      .values({ ...r, active: true, sortOrder: i })
      .run();
  });

  const promos = [
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
  promos.forEach((p, i) => {
    db.insert(schema.promos)
      .values({ ...p, active: true, sortOrder: i })
      .run();
  });

  const portfolio = [
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
  portfolio.forEach((p, i) => {
    db.insert(schema.portfolioItems)
      .values({ ...p, active: true, sortOrder: i })
      .run();
  });

  const featuredIds = seedProducts
    .filter((p) => featuredNames.has(p.name))
    .map((p) => p.id);

  const siteSettings = { ...defaultSettings, featuredProductIds: featuredIds };
  const existing = db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, "site"))
    .get();
  if (existing) {
    db.update(schema.settings)
      .set({ value: siteSettings })
      .where(eq(schema.settings.key, "site"))
      .run();
  } else {
    db.insert(schema.settings)
      .values({ key: "site", value: siteSettings })
      .run();
  }
}
