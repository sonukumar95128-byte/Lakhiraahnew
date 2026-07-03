import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/adminSession";

async function isAdmin() {
  const jar = await cookies();
  return verifyAdminToken(jar.get("admin_auth")?.value);
}

// In-memory cache — avoids hitting MySQL on every page load
let cache: { data: Record<string, unknown>; at: number } | null = null;
const CACHE_TTL_MS = 60_000; // 1 minute

function invalidateCache() { cache = null; }

// GET /api/admin/config
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const key = request.nextUrl.searchParams.get("key");
  try {
    // Serve from memory cache if fresh
    if (!key && cache && Date.now() - cache.at < CACHE_TTL_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "private, no-store" },
      });
    }

    const prisma = getPrisma();
    if (key) {
      const row = await prisma.siteConfig.findUnique({ where: { key } });
      return NextResponse.json(row ? row.value : null);
    }
    const rows = await prisma.siteConfig.findMany();
    const result: Record<string, unknown> = {};
    for (const row of rows) result[row.key] = row.value;

    // Store in memory cache
    cache = { data: result, at: Date.now() };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

// POST /api/admin/config  body: { key: string; value: unknown }
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
    const prisma = getPrisma();
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    invalidateCache(); // fresh data on next GET
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
