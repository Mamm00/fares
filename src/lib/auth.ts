import crypto from "node:crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "fm-dev-secret-change-me";
const PASSWORD = process.env.ADMIN_PASSWORD || "fares2025";

export const ADMIN_COOKIE = "fm_admin_token";

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function makeToken(): string {
  const payload = `admin.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export function checkPassword(password: string): boolean {
  return password.length > 0 && password === PASSWORD;
}
