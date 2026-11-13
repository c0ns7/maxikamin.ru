import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { getDb } from "./client";
import { ensureSeeded } from "./ensure-seeded";
import {
  brands,
  categories,
  portfolioItems,
  products,
  promos,
  reviews,
  settings,
  type ProductRow,
} from "./schema";
import type {
  PortfolioItem,
  Product,
  Promo,
  Review,
  SiteSettings,
} from "@/lib/types";
import { normalizeProductImages } from "@/lib/product-images";
import { defaultSettings } from "./defaults";

export { defaultSettings };

function mapProduct(row: ProductRow): Product {
  const images = normalizeProductImages(
    Array.isArray(row.images) ? row.images : undefined,
    row.image,
  );
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    image: images[0] ?? row.image,
    images,
    description: row.description,
    specs: row.specs ?? undefined,
    line: row.line ?? undefined,
    featured: row.featured,
    active: row.active,
    sortOrder: row.sortOrder,
  };
}

export function listProducts(opts?: {
  includeInactive?: boolean;
  category?: string;
  brand?: string;
  q?: string;
}) {
  ensureSeeded();
  const db = getDb();
  const conditions = [];

  if (!opts?.includeInactive) {
    conditions.push(eq(products.active, true));
  }
  if (opts?.category) conditions.push(eq(products.category, opts.category));
  if (opts?.brand) conditions.push(eq(products.brand, opts.brand));
  if (opts?.q) {
    const term = `%${opts.q}%`;
    conditions.push(
      or(like(products.name, term), like(products.description, term))!,
    );
  }

  const rows = db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(products.sortOrder), asc(products.name))
    .all();

  return rows.map(mapProduct);
}

export function getProduct(id: string) {
  ensureSeeded();
  const row = getDb()
    .select()
    .from(products)
    .where(eq(products.id, id))
    .get();
  return row ? mapProduct(row) : undefined;
}

export function getProductByName(name: string) {
  ensureSeeded();
  const row = getDb()
    .select()
    .from(products)
    .where(eq(products.name, name))
    .get();
  return row ? mapProduct(row) : undefined;
}

export function getRelatedProducts(product: Product, limit = 4) {
  return listProducts({ category: product.category })
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}

export function getFeaturedProducts(ids?: string[]) {
  if (ids?.length) {
    return ids
      .map((idOrName) => getProduct(idOrName) ?? getProductByName(idOrName))
      .filter((p): p is Product => Boolean(p && p.active !== false));
  }
  return getDb()
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.featured, true)))
    .orderBy(asc(products.sortOrder))
    .all()
    .map(mapProduct);
}

export function createProduct(
  input: Omit<Product, "featured" | "active" | "sortOrder"> & {
    featured?: boolean;
    active?: boolean;
    sortOrder?: number;
  },
) {
  const db = getDb();
  const images = normalizeProductImages(input.images, input.image);
  const image = images[0] ?? input.image;

  db.insert(products)
    .values({
      id: input.id,
      name: input.name,
      brand: input.brand,
      category: input.category,
      price: input.price,
      image,
      images,
      description: input.description,
      specs: input.specs ?? null,
      line: input.line ?? null,
      featured: input.featured ?? false,
      active: input.active ?? true,
      sortOrder: input.sortOrder ?? 0,
      updatedAt: sql`(datetime('now'))`,
    })
    .run();
  return getProduct(input.id)!;
}

export function updateProduct(id: string, patch: Partial<Product>) {
  const db = getDb();
  const current = getProduct(id);
  if (!current) return undefined;

  const images = normalizeProductImages(
    patch.images ?? current.images,
    patch.image ?? current.image,
  );
  const image = images[0] ?? patch.image ?? current.image;

  db.update(products)
    .set({
      name: patch.name ?? current.name,
      brand: patch.brand ?? current.brand,
      category: patch.category ?? current.category,
      price: patch.price ?? current.price,
      image,
      images,
      description: patch.description ?? current.description,
      specs: patch.specs === undefined ? current.specs ?? null : patch.specs,
      line: patch.line === undefined ? current.line ?? null : patch.line,
      featured: patch.featured ?? current.featured ?? false,
      active: patch.active ?? current.active ?? true,
      sortOrder: patch.sortOrder ?? current.sortOrder ?? 0,
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(products.id, id))
    .run();

  return getProduct(id);
}

export function deleteProduct(id: string) {
  getDb().delete(products).where(eq(products.id, id)).run();
}

export function listCategories() {
  ensureSeeded();
  return getDb()
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .all();
}

export function upsertCategory(input: {
  id?: string;
  name: string;
  image?: string;
  sortOrder?: number;
}) {
  const db = getDb();
  const id = input.id ?? slugify(input.name);
  const existing = db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .get();

  if (existing) {
    db.update(categories)
      .set({
        name: input.name,
        image: input.image ?? existing.image,
        sortOrder: input.sortOrder ?? existing.sortOrder,
      })
      .where(eq(categories.id, id))
      .run();
  } else {
    db.insert(categories)
      .values({
        id,
        name: input.name,
        image: input.image ?? "",
        sortOrder: input.sortOrder ?? 0,
      })
      .run();
  }
  return db.select().from(categories).where(eq(categories.id, id)).get()!;
}

export function deleteCategory(id: string) {
  getDb().delete(categories).where(eq(categories.id, id)).run();
}

export function listBrands() {
  ensureSeeded();
  return getDb()
    .select()
    .from(brands)
    .orderBy(asc(brands.sortOrder), asc(brands.name))
    .all();
}

export function upsertBrand(input: {
  id?: string;
  name: string;
  assortment?: string[];
  sortOrder?: number;
}) {
  const db = getDb();
  const id = input.id ?? slugify(input.name);
  const existing = db.select().from(brands).where(eq(brands.id, id)).get();

  if (existing) {
    db.update(brands)
      .set({
        name: input.name,
        assortment: input.assortment ?? existing.assortment,
        sortOrder: input.sortOrder ?? existing.sortOrder,
      })
      .where(eq(brands.id, id))
      .run();
  } else {
    db.insert(brands)
      .values({
        id,
        name: input.name,
        assortment: input.assortment ?? [],
        sortOrder: input.sortOrder ?? 0,
      })
      .run();
  }
  return db.select().from(brands).where(eq(brands.id, id)).get()!;
}

export function deleteBrand(id: string) {
  getDb().delete(brands).where(eq(brands.id, id)).run();
}

export function listReviews(includeInactive = false) {
  ensureSeeded();
  const db = getDb();
  const rows = includeInactive
    ? db.select().from(reviews).orderBy(asc(reviews.sortOrder)).all()
    : db
        .select()
        .from(reviews)
        .where(eq(reviews.active, true))
        .orderBy(asc(reviews.sortOrder))
        .all();
  return rows as Review[];
}

export function upsertReview(input: Review) {
  const db = getDb();
  const existing = db
    .select()
    .from(reviews)
    .where(eq(reviews.id, input.id))
    .get();
  if (existing) {
    db.update(reviews)
      .set({
        name: input.name,
        place: input.place,
        text: input.text,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
      })
      .where(eq(reviews.id, input.id))
      .run();
  } else {
    db.insert(reviews)
      .values({
        id: input.id,
        name: input.name,
        place: input.place,
        text: input.text,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
      })
      .run();
  }
  return listReviews(true).find((r) => r.id === input.id)!;
}

export function deleteReview(id: string) {
  getDb().delete(reviews).where(eq(reviews.id, id)).run();
}

export function listPromos(includeInactive = false) {
  ensureSeeded();
  const db = getDb();
  const rows = includeInactive
    ? db.select().from(promos).orderBy(asc(promos.sortOrder)).all()
    : db
        .select()
        .from(promos)
        .where(eq(promos.active, true))
        .orderBy(asc(promos.sortOrder))
        .all();
  return rows as Promo[];
}

export function upsertPromo(input: Promo) {
  const db = getDb();
  const existing = db.select().from(promos).where(eq(promos.id, input.id)).get();
  if (existing) {
    db.update(promos)
      .set({
        title: input.title,
        text: input.text,
        until: input.until,
        image: input.image,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
      })
      .where(eq(promos.id, input.id))
      .run();
  } else {
    db.insert(promos)
      .values({
        id: input.id,
        title: input.title,
        text: input.text,
        until: input.until,
        image: input.image,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
      })
      .run();
  }
  return listPromos(true).find((p) => p.id === input.id)!;
}

export function deletePromo(id: string) {
  getDb().delete(promos).where(eq(promos.id, id)).run();
}

export function listPortfolio(includeInactive = false) {
  ensureSeeded();
  const db = getDb();
  const rows = includeInactive
    ? db
        .select()
        .from(portfolioItems)
        .orderBy(asc(portfolioItems.sortOrder))
        .all()
    : db
        .select()
        .from(portfolioItems)
        .where(eq(portfolioItems.active, true))
        .orderBy(asc(portfolioItems.sortOrder))
        .all();
  return rows as PortfolioItem[];
}

export function upsertPortfolioItem(input: PortfolioItem) {
  const db = getDb();
  const existing = db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.id, input.id))
    .get();
  if (existing) {
    db.update(portfolioItems)
      .set({
        title: input.title,
        place: input.place,
        image: input.image,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
      })
      .where(eq(portfolioItems.id, input.id))
      .run();
  } else {
    db.insert(portfolioItems)
      .values({
        id: input.id,
        title: input.title,
        place: input.place,
        image: input.image,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
      })
      .run();
  }
  return listPortfolio(true).find((p) => p.id === input.id)!;
}

export function deletePortfolioItem(id: string) {
  getDb().delete(portfolioItems).where(eq(portfolioItems.id, id)).run();
}

function normalizeSettings(stored: Partial<SiteSettings> | null | undefined): SiteSettings {
  const raw = stored ?? {};
  const contacts = {
    ...defaultSettings.contacts,
    ...(raw.contacts ?? {}),
  };

  // Upgrade leftover demo placeholders from early seeds.
  if (/123[- ]?45[- ]?67/.test(contacts.phone)) {
    contacts.phone = defaultSettings.contacts.phone;
    contacts.phone2 = contacts.phone2 || defaultSettings.contacts.phone2;
  }
  if (/info@maxi-kamin\.ru/i.test(contacts.email)) {
    contacts.email = defaultSettings.contacts.email;
  }
  if (/maxi-kamin\.ru/i.test(contacts.site)) {
    contacts.site = defaultSettings.contacts.site;
  }

  const hero = { ...defaultSettings.hero, ...(raw.hero ?? {}) };
  if (/Maxi-Kamin/i.test(hero.headline)) {
    hero.headline = defaultSettings.hero.headline;
  }

  const storedPages = (raw.pages ?? {}) as Partial<SiteSettings["pages"]>;
  const pages: SiteSettings["pages"] = {
    about: {
      ...defaultSettings.pages.about,
      ...(storedPages.about ?? {}),
      facts:
        storedPages.about?.facts?.length
          ? storedPages.about.facts
          : defaultSettings.pages.about.facts,
    },
    production: {
      ...defaultSettings.pages.production,
      ...(storedPages.production ?? {}),
      stages:
        storedPages.production?.stages?.length
          ? storedPages.production.stages
          : defaultSettings.pages.production.stages,
    },
    contacts: {
      ...defaultSettings.pages.contacts,
      ...(storedPages.contacts ?? {}),
    },
    delivery: {
      ...defaultSettings.pages.delivery,
      ...(storedPages.delivery ?? {}),
    },
  };

  return {
    ...defaultSettings,
    ...raw,
    contacts,
    hero,
    pages,
    metaTitle: (raw.metaTitle ?? defaultSettings.metaTitle).replace(
      /Maxi-Kamin/g,
      "MaxiKamin",
    ),
    featuredProductIds:
      raw.featuredProductIds ?? defaultSettings.featuredProductIds,
  };
}

export function getSettings(): SiteSettings {
  ensureSeeded();
  const row = getDb()
    .select()
    .from(settings)
    .where(eq(settings.key, "site"))
    .get();
  if (!row) return defaultSettings;
  return normalizeSettings(row.value as SiteSettings);
}

export function saveSettings(next: SiteSettings) {
  const db = getDb();
  const existing = db
    .select()
    .from(settings)
    .where(eq(settings.key, "site"))
    .get();
  if (existing) {
    db.update(settings)
      .set({ value: next })
      .where(eq(settings.key, "site"))
      .run();
  } else {
    db.insert(settings).values({ key: "site", value: next }).run();
  }
  return getSettings();
}

export function getDashboardStats() {
  ensureSeeded();
  const db = getDb();
  const productCount = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .get()?.count;
  const activeCount = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.active, true))
    .get()?.count;
  const brandCount = db
    .select({ count: sql<number>`count(*)` })
    .from(brands)
    .get()?.count;
  const reviewCount = db
    .select({ count: sql<number>`count(*)` })
    .from(reviews)
    .get()?.count;
  const promoCount = db
    .select({ count: sql<number>`count(*)` })
    .from(promos)
    .get()?.count;

  const latest = db
    .select()
    .from(products)
    .orderBy(desc(products.updatedAt))
    .limit(5)
    .all()
    .map(mapProduct);

  return {
    productCount: Number(productCount ?? 0),
    activeCount: Number(activeCount ?? 0),
    brandCount: Number(brandCount ?? 0),
    reviewCount: Number(reviewCount ?? 0),
    promoCount: Number(promoCount ?? 0),
    latest,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яё\-]/gi, "")
    .slice(0, 64);
}

export function nextProductId() {
  const row = getDb()
    .select({ id: products.id })
    .from(products)
    .all()
    .map((r) => Number(r.id))
    .filter((n) => !Number.isNaN(n));
  const max = row.length ? Math.max(...row) : 100;
  return String(max + 1);
}
