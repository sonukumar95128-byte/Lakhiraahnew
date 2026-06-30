import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Terms & Conditions — Lakshiraah" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        By using the Lakshiraah website and placing an order with us, you agree to the following terms.
      </p>

      <h2>Products</h2>
      <p>
        We make every effort to display our jewellery accurately, including metal purity, diamond/gemstone
        specifications, and weight. Minor variations in weight and stone placement may occur as each piece is
        individually crafted.
      </p>

      <h2>Pricing</h2>
      <p>
        Prices are listed in Indian Rupees (₹) and are subject to change without prior notice. Gold and diamond
        rates may fluctuate; the price confirmed at checkout is final for that order.
      </p>

      <h2>Orders & payment</h2>
      <p>
        Orders are confirmed once payment is received (or, where offered, on confirmation via WhatsApp/phone for
        cash-on-delivery or manual payment arrangements).
      </p>

      <h2>Returns & exchanges</h2>
      <p>
        See our <a href="/help/shipping-returns">Shipping &amp; Returns</a> page for details on our 15-day return
        and exchange policy.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        Lakshiraah is not liable for indirect or consequential damages arising from the use of this website or
        our products, to the extent permitted by law.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the site means you accept the current terms.</p>
    </LegalPage>
  );
}
