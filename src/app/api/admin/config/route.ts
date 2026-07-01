import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("admin_auth")?.value === "1";
}

// GET /api/admin/config?key=banners  — omit key to get all
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  try {
    const prisma = getPrisma();
    if (key) {
      const row = await prisma.siteConfig.findUnique({ where: { key } });
      return NextResponse.json(row ? row.value : null);
    }
    const rows = await prisma.siteConfig.findMany();
    const result: Record<string, unknown> = {};
    for (const row of rows) result[row.key] = row.value;
    return NextResponse.json(result);
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
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
