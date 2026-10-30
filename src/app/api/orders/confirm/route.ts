import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import type { GuestOrder } from "@/app/api/orders/route";

/**
 * POST /api/orders/confirm — customer facing.
 *
 * The shopper pays by UPI outside the site, then tells us they've paid and
 * (optionally) hands over the UTR. That claim is recorded against the order
 * but never marks it paid: an admin still verifies the money arrived and
 * flips the status from the orders screen.
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, utrNumber } = await request.json();
    if (!orderId) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

    const prisma = getPrisma();
    const row = await prisma.siteConfig.findUnique({ where: { key: "guestOrders" } });
    const orders = (row?.value as GuestOrder[]) ?? [];

    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (orders[idx].status !== "pending_payment") {
      return NextResponse.json({ ok: true, status: orders[idx].status });
    }

    orders[idx] = {
      ...orders[idx],
      utrNumber: typeof utrNumber === "string" ? utrNumber.trim().slice(0, 40) : orders[idx].utrNumber,
      customerClaimedPaidAt: new Date().toISOString(),
    };

    await prisma.siteConfig.upsert({
      where: { key: "guestOrders" },
      update: { value: orders as never },
      create: { key: "guestOrders", value: orders as never },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Order confirm error:", err);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
