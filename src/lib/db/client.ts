import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __mkSqlite?: Database.Database;
  __mkDb?: ReturnType<typeof drizzle<typeof schema>>;
};

function resolveDbPath() {
  return path.join(process.cwd(), "data", "maxi-kamin.db");
}

function ensureSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      images TEXT NOT NULL DEFAULT '[]',
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

  migrateProductsImages(sqlite);
}

function migrateProductsImages(sqlite: Database.Database) {
  const cols = sqlite.prepare("PRAGMA table_info(products)").all() as {
    name: string;
  }[];
  if (!cols.some((c) => c.name === "images")) {
    sqlite.exec(
      `ALTER TABLE products ADD COLUMN images TEXT NOT NULL DEFAULT '[]'`,
    );
  }

  // Backfill empty galleries from cover image once.
  const rows = sqlite
    .prepare(
      `SELECT id, image, images FROM products
       WHERE image IS NOT NULL AND image != ''`,
    )
    .all() as { id: string; image: string; images: string }[];

  const update = sqlite.prepare(`UPDATE products SET images = ? WHERE id = ?`);
  for (const row of rows) {
    let list: string[] = [];
    try {
      const parsed = JSON.parse(row.images || "[]");
      if (Array.isArray(parsed)) list = parsed.filter(Boolean);
    } catch {
      list = [];
    }
    if (list.length === 0) {
      update.run(JSON.stringify([row.image]), row.id);
    }
  }
}

export function getSqlite() {
  if (globalForDb.__mkSqlite) return globalForDb.__mkSqlite;

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  ensureSchema(sqlite);

  globalForDb.__mkSqlite = sqlite;
  return sqlite;
}

export function getDb() {
  if (globalForDb.__mkDb) return globalForDb.__mkDb;
  const db = drizzle(getSqlite(), { schema });
  globalForDb.__mkDb = db;
  return db;
}

export function isDatabaseSeeded() {
  const row = getSqlite().prepare("SELECT COUNT(*) as c FROM products").get() as {
    c: number;
  };
  return Number(row?.c ?? 0) > 0;
}
