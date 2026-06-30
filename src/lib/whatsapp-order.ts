import { formatRupee } from "@/lib/dummy-images";

type OrderItem = { name: string; quantity: number; lineTotal: number };

type OrderDetails = {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  address: {
    fullName: string;
    countryCode: string;
    phone: string;
    line1: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
};

export function buildWhatsAppOrderUrl(order: OrderDetails): string {
  const businessNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? "";

  const lines = [
    "Hi Lakshiraah, I'd like to place this order:",
    "",
    ...order.items.map((i) => `• ${i.name} x${i.quantity} — ${formatRupee(i.lineTotal)}`),
    "",
    `Subtotal: ${formatRupee(order.subtotal)}`,
    order.discount > 0 ? `Discount: -${formatRupee(order.discount)}` : null,
    `Total: ${formatRupee(order.total)}`,
    "",
    "Shipping address:",
    `${order.address.fullName} · ${order.address.countryCode}${order.address.phone}`,
    `${order.address.line1}${order.address.landmark ? `, near ${order.address.landmark}` : ""}`,
    `${order.address.city}, ${order.address.state} — ${order.address.pincode}, ${order.address.country}`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${businessNumber}?text=${text}`;
}
