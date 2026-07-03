import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";

export async function GET() {
  const userId = await getUserSession();
  if (!userId) return NextResponse.json([], { status: 401 });

  try {
    const prisma = getPrisma();
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    // Input validation
    const str = (v: unknown, max: number) => typeof v === "string" && v.trim().length > 0 && v.length <= max;
    if (!str(body.fullName, 100)) return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    if (!str(body.phone, 20)) return NextResponse.json({ error: "Invalid phone." }, { status: 400 });
    if (!str(body.line1, 200)) return NextResponse.json({ error: "Invalid address." }, { status: 400 });
    if (!str(body.city, 100)) return NextResponse.json({ error: "Invalid city." }, { status: 400 });
    if (!str(body.state, 100)) return NextResponse.json({ error: "Invalid state." }, { status: 400 });
    if (!/^\d{6}$/.test(body.pincode)) return NextResponse.json({ error: "Invalid pincode." }, { status: 400 });

    const prisma = getPrisma();

    // If new address is default, clear other defaults first
    if (body.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName: body.fullName,
        phone: body.phone,
        line1: body.line1,
        line2: body.landmark ?? null,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        country: body.country ?? "India",
        isDefault: body.isDefault ?? false,
      },
    });
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: "Failed to add address." }, { status: 500 });
  }
}
