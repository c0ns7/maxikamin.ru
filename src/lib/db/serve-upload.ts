import fs from "fs";
import path from "path";
import { Readable } from "stream";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

function resolveUploadPath(parts: string[]) {
  if (!parts.length) return null;
  if (parts.some((p) => !p || p === "." || p === ".." || p.includes("\0"))) {
    return null;
  }

  // Keep path statically scoped under public/uploads for Turbopack tracing.
  const abs = path.join(UPLOADS_ROOT, ...parts);
  const root = path.resolve(UPLOADS_ROOT);
  const resolved = path.resolve(abs);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

export async function serveUploadResponse(parts: string[]) {
  const abs = resolveUploadPath(parts);
  if (!abs) {
    return new Response("Not found", { status: 404 });
  }

  if (
    !fs.existsSync(/*turbopackIgnore: true*/ abs) ||
    !fs.statSync(/*turbopackIgnore: true*/ abs).isFile()
  ) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(abs).toLowerCase();
  const mime = MIME_BY_EXT[ext] ?? "application/octet-stream";
  const stat = fs.statSync(/*turbopackIgnore: true*/ abs);
  const nodeStream = fs.createReadStream(/*turbopackIgnore: true*/ abs);
  const body = Readable.toWeb(nodeStream) as ReadableStream;

  const headers: Record<string, string> = {
    "Content-Type": mime,
    "Content-Length": String(stat.size),
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Last-Modified": stat.mtime.toUTCString(),
  };

  if (ext === ".svg") {
    headers["Content-Security-Policy"] =
      "default-src 'none'; style-src 'unsafe-inline'";
  }

  return new Response(body, { status: 200, headers });
}
