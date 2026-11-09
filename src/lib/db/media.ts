import fs from "fs";
import path from "path";
import { createHash, randomBytes } from "crypto";
import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { ensureSeeded } from "./ensure-seeded";
import { UPLOAD_PUBLIC_PREFIX, isUploadedMedia } from "./media-shared";
import { mediaFiles, type MediaRow } from "./schema";

export { isUploadedMedia } from "./media-shared";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const PUBLIC_PREFIX = UPLOAD_PUBLIC_PREFIX;
const IMAGE_ROOTS = ["images", "uploads"] as const;

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
]);

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

const ALLOWED = new Set(Object.values(MIME_BY_EXT));

let syncedOnce = false;

export function ensureUploadDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function walkImages(dir: string, baseUrl: string, out: string[]) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    const url = `${baseUrl}/${entry.name}`.replace(/\\/g, "/");
    if (entry.isDirectory()) {
      walkImages(abs, url, out);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (IMAGE_EXT.has(ext)) out.push(url);
  }
}

function collectPublicImageUrls() {
  const urls: string[] = [];
  for (const root of IMAGE_ROOTS) {
    walkImages(path.join(PUBLIC_DIR, root), `/${root}`, urls);
  }
  return urls;
}

function stableIdForUrl(url: string) {
  return createHash("sha1").update(url).digest("hex").slice(0, 16);
}

/** Index every image under public/images and public/uploads into the gallery DB. */
export function syncLibraryMedia() {
  ensureSeeded();
  const db = getDb();
  const existing = new Set(
    db
      .select({ url: mediaFiles.url })
      .from(mediaFiles)
      .all()
      .map((r) => r.url),
  );

  let added = 0;
  for (const url of collectPublicImageUrls()) {
    if (existing.has(url)) continue;
    const abs = path.join(PUBLIC_DIR, url.replace(/^\//, ""));
    let size = 0;
    try {
      size = fs.statSync(abs).size;
    } catch {
      continue;
    }
    const ext = path.extname(url).toLowerCase();
    const filename = path.basename(url);
    try {
      db.insert(mediaFiles)
        .values({
          id: stableIdForUrl(url),
          filename,
          originalName: filename,
          url,
          mime: MIME_BY_EXT[ext] ?? "image/jpeg",
          size,
        })
        .run();
      added += 1;
    } catch {
      // duplicate id/url — skip
    }
  }
  return added;
}

export function ensureMediaLibrarySynced() {
  if (syncedOnce) return;
  syncedOnce = true;
  syncLibraryMedia();
}

export function listMedia(opts?: { q?: string; folder?: string }) {
  ensureMediaLibrarySynced();
  let rows = getDb()
    .select()
    .from(mediaFiles)
    .orderBy(asc(mediaFiles.url))
    .all() as MediaRow[];

  if (opts?.folder) {
    const prefix = opts.folder.startsWith("/")
      ? opts.folder
      : `/${opts.folder}`;
    rows = rows.filter((r) => r.url.startsWith(prefix));
  }
  if (opts?.q) {
    const term = opts.q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.url.toLowerCase().includes(term) ||
        r.originalName.toLowerCase().includes(term),
    );
  }
  return rows;
}

function folderKeyForUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  // /images/catalog/madeira/7.jpg -> /images/catalog/madeira
  if (parts[0] === "images" && parts[1] === "catalog" && parts[2]) {
    return `/images/catalog/${parts[2]}`;
  }
  if (parts[0] === "uploads") return "/uploads/gallery";
  if (parts[0] === "images" && parts[1]) return `/images/${parts[1]}`;
  return `/${parts[0] ?? "images"}`;
}

export function mediaFolders() {
  ensureMediaLibrarySynced();
  const counts = new Map<string, number>();
  for (const row of getDb().select({ url: mediaFiles.url }).from(mediaFiles).all()) {
    const folder = folderKeyForUrl(row.url);
    counts.set(folder, (counts.get(folder) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([folder, count]) => ({ folder, count }))
    .sort((a, b) => a.folder.localeCompare(b.folder, "ru"));
}

function absolutePublicPath(url: string) {
  const normalized = url.replace(/^\//, "").replace(/\//g, path.sep);
  const abs = path.resolve(PUBLIC_DIR, normalized);
  if (!abs.startsWith(path.resolve(PUBLIC_DIR) + path.sep) && abs !== path.resolve(PUBLIC_DIR)) {
    throw new Error("Некорректный путь файла");
  }
  return abs;
}

export function getMediaById(id: string) {
  ensureSeeded();
  return getDb().select().from(mediaFiles).where(eq(mediaFiles.id, id)).get();
}

export function deleteMedia(id: string) {
  ensureSeeded();
  const db = getDb();
  const row = db.select().from(mediaFiles).where(eq(mediaFiles.id, id)).get();
  if (!row) return false;

  const filePath = absolutePublicPath(row.url);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      // ignore missing file on disk
    }
  }

  db.delete(mediaFiles).where(eq(mediaFiles.id, id)).run();
  return true;
}

/** Overwrite file bytes at the same public URL — path/link stays unchanged. */
export async function replaceMedia(id: string, file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Допустимы только изображения: JPG, PNG, WEBP, GIF, SVG");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Файл больше 12 МБ");
  }

  ensureSeeded();
  const db = getDb();
  const row = db.select().from(mediaFiles).where(eq(mediaFiles.id, id)).get();
  if (!row) throw new Error("Файл не найден");

  const abs = absolutePublicPath(row.url);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(abs, buffer);

  db.update(mediaFiles)
    .set({
      originalName: file.name || row.originalName,
      mime: file.type || row.mime,
      size: file.size,
    })
    .where(eq(mediaFiles.id, id))
    .run();

  return getDb().select().from(mediaFiles).where(eq(mediaFiles.id, id)).get()!;
}

export async function saveUploadedMedia(file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Допустимы только изображения: JPG, PNG, WEBP, GIF, SVG");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Файл больше 12 МБ");
  }

  ensureUploadDir();
  ensureSeeded();
  ensureMediaLibrarySynced();

  const ext =
    path.extname(file.name).toLowerCase() ||
    (file.type === "image/png"
      ? ".png"
      : file.type === "image/webp"
        ? ".webp"
        : file.type === "image/gif"
          ? ".gif"
          : file.type === "image/svg+xml"
            ? ".svg"
            : ".jpg");

  const id = randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${id}${ext}`;
  const abs = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(abs, buffer);

  const url = `${PUBLIC_PREFIX}/${filename}`;
  getDb()
    .insert(mediaFiles)
    .values({
      id,
      filename,
      originalName: file.name,
      url,
      mime: file.type,
      size: file.size,
    })
    .run();

  return getDb().select().from(mediaFiles).where(eq(mediaFiles.id, id)).get()!;
}
