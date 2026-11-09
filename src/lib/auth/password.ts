import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { ensureSeeded } from "@/lib/db/ensure-seeded";
import { settings } from "@/lib/db/schema";

const AUTH_KEY = "admin_auth";

type AuthRecord = {
  passwordHash: string;
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyHash(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

function readAuthRecord(): AuthRecord | null {
  ensureSeeded();
  const row = getDb()
    .select()
    .from(settings)
    .where(eq(settings.key, AUTH_KEY))
    .get();
  if (!row || !row.value || typeof row.value !== "object") return null;
  const value = row.value as AuthRecord;
  return value.passwordHash ? value : null;
}

function writeAuthRecord(record: AuthRecord) {
  const db = getDb();
  const existing = db
    .select()
    .from(settings)
    .where(eq(settings.key, AUTH_KEY))
    .get();
  if (existing) {
    db.update(settings)
      .set({ value: record })
      .where(eq(settings.key, AUTH_KEY))
      .run();
  } else {
    db.insert(settings).values({ key: AUTH_KEY, value: record }).run();
  }
}

/** Env password, or temporary local-only default outside production. */
export function getBootstrapPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production") return null;
  return "admin123";
}

export function hasCustomAdminPassword() {
  return Boolean(readAuthRecord()?.passwordHash);
}

export function verifyAdminPassword(password: string) {
  const custom = readAuthRecord();
  if (custom?.passwordHash) {
    return verifyHash(password, custom.passwordHash);
  }
  const bootstrap = getBootstrapPassword();
  if (!bootstrap) return false;
  return password === bootstrap;
}

export function changeAdminPassword(current: string, next: string) {
  if (!verifyAdminPassword(current)) {
    return { ok: false as const, error: "Текущий пароль неверный" };
  }
  if (next.trim().length < 8) {
    return {
      ok: false as const,
      error: "Новый пароль должен быть не короче 8 символов",
    };
  }
  writeAuthRecord({ passwordHash: hashPassword(next.trim()) });
  return { ok: true as const };
}
