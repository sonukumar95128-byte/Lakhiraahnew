import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Size Guide — Lakshiraah" };

export default function SizeGuidePage() {
  return (
    <LegalPage title="Size Guide">
      <h2>Ring sizing</h2>
      <p>
        Not sure of your ring size? Wrap a strip of paper around the base of your finger, mark where it overlaps,
        and measure the length in millimetres. Compare against a standard ring-size chart, or visit any local
        jeweller for an accurate measurement.
      </p>

      <h2>Bracelet & bangle sizing</h2>
      <p>
        Measure around your wrist with a soft tape, just below the wrist bone. Add 1-1.5cm for a comfortable fit.
        Our bangles are typically available in S / M / L.
      </p>

      <h2>Necklace & chain lengths</h2>
      <ul>
        <li>16in — sits at the collarbone (choker length)</li>
        <li>18in — classic, just below the collarbone</li>
        <li>20in+ — sits at or below the neckline</li>
      </ul>

      <p>Still unsure? Reach out via our <a href="/help/contact">Contact page</a> and we&apos;ll help you find the right fit.</p>
    </LegalPage>
  );
}
