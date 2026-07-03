import crypto from "crypto";

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set");
  return s;
}

export function signAdminToken(): string {
  const ts = Date.now().toString();
  const sig = crypto.createHmac("sha256", secret()).update(ts).digest("hex");
  return `${ts}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const ts = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!ts || !sig) return false;
  try {
    const expected = crypto.createHmac("sha256", secret()).update(ts).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch {
    return false;
  }
}
