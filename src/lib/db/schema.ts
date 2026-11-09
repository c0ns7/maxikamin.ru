import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull().default(""),
  specs: text("specs", { mode: "json" }).$type<Record<string, string>>(),
  line: text("line"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const brands = sqliteTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  assortment: text("assortment", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  place: text("place").notNull().default(""),
  text: text("text").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const promos = sqliteTable("promos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  until: text("until").notNull().default(""),
  image: text("image").notNull().default(""),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  place: text("place").notNull().default(""),
  image: text("image").notNull().default(""),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).$type<unknown>().notNull(),
});

export const mediaFiles = sqliteTable("media_files", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mime: text("mime").notNull().default("image/jpeg"),
  size: integer("size").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type MediaRow = typeof mediaFiles.$inferSelect;

export type ProductRow = typeof products.$inferSelect;
export type CategoryRow = typeof categories.$inferSelect;
export type BrandRow = typeof brands.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type PromoRow = typeof promos.$inferSelect;
export type PortfolioRow = typeof portfolioItems.$inferSelect;
