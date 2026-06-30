import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Shipping & Returns — Lakshiraah" };

export default function ShippingReturnsPage() {
  return (
    <LegalPage title="Shipping & Returns">
      <h2>Shipping</h2>
      <ul>
        <li>Free shipping on orders over ₹999; a flat fee applies below that.</li>
        <li>Orders are typically dispatched within 1-3 business days.</li>
        <li>All shipments are insured and require a signature on delivery.</li>
      </ul>

      <h2>Returns & exchanges</h2>
      <ul>
        <li>We offer a 15-day return/exchange window from the date of delivery.</li>
        <li>Items must be unworn, in original condition, with all tags and certificates intact.</li>
        <li>Made-to-order, engraved, or resized pieces are not eligible for return.</li>
      </ul>

      <h2>How to start a return</h2>
      <p>
        Contact us via the <a href="/help/contact">Contact page</a> or WhatsApp with your order number, and we&apos;ll
        guide you through the process.
      </p>

      <h2>Refunds</h2>
      <p>Once we receive and inspect the returned item, refunds are processed within 5-7 business days to the original payment method.</p>
    </LegalPage>
  );
}
