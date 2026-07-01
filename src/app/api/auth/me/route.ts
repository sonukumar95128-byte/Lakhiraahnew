import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";

export async function GET() {
  const userId = await getUserSession();
  if (!userId) return NextResponse.json(null);

  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });
    return NextResponse.json(user ?? null);
  } catch {
    return NextResponse.json(null);
  }
}

// Update profile
export async function PATCH(request: Request) {
  const userId = await getUserSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, phone } = await request.json();
    const prisma = getPrisma();
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
