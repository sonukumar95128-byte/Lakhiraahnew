import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "user_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  return process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "lakshiraah-dev-secret";
}

function sign(userId: string): string {
  const sig = crypto.createHmac("sha256", secret()).update(userId).digest("hex");
  return `${Buffer.from(userId).toString("base64url")}.${sig}`;
}

function verify(token: string): string | null {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const userId = Buffer.from(b64, "base64url").toString();
  const expected = crypto.createHmac("sha256", secret()).update(userId).digest("hex");
  if (expected !== sig) return null;
  return userId;
}

export async function setUserSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, sign(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function getUserSession(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verify(token);
}

export async function clearUserSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
