import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Care & Warranty — Lakshiraah" };

export default function CareWarrantyPage() {
  return (
    <LegalPage title="Care & Warranty">
      <h2>Caring for your jewellery</h2>
      <ul>
        <li>Avoid contact with water, perfume, and household chemicals.</li>
        <li>Store pieces separately in a soft pouch or lined box to prevent scratching.</li>
        <li>Remove jewellery before swimming, exercising, or sleeping.</li>
        <li>Clean gently with a soft, dry cloth after each wear.</li>
      </ul>

      <h2>Lifetime maintenance</h2>
      <p>
        Every Lakshiraah piece comes with complimentary lifetime maintenance — polishing, cleaning, and minor
        repairs (such as clasp tightening) at no extra cost. Contact us to arrange a maintenance visit.
      </p>

      <h2>Hallmarking & certification</h2>
      <p>
        All gold jewellery is BIS hallmarked, and diamonds are certified (IGI/DGLA as noted on the product page) so
        you can shop with confidence.
      </p>
    </LegalPage>
  );
}
