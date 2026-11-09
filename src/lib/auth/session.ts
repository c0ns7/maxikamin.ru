import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "mk_admin_session";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const value =
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "production" ? "" : "maxi-kamin-local-secret");
  if (!value) {
    throw new Error(
      "ADMIN_SECRET (or ADMIN_PASSWORD) must be set in production",
    );
  }
  return value;
}

/** @deprecated Prefer verifyAdminPassword from password.ts */
export function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production") return "";
  return "admin123";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [issuedAt, sig] = token.split(".");
  if (!issuedAt || !sig) return false;
  const expected = sign(issuedAt);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const age = Date.now() - Number(issuedAt);
  if (Number.isNaN(age) || age < 0 || age > ADMIN_MAX_AGE * 1000) return false;
  return true;
}
