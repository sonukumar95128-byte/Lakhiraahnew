import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — Lakshiraah" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Lakshiraah (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This policy
        explains what information we collect, how we use it, and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you provide — name, phone number, email, and delivery address.</li>
        <li>Order history and preferences, to help us serve you better.</li>
        <li>Basic device/browser information collected automatically for security and analytics.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process and deliver your orders.</li>
        <li>To respond to enquiries and provide customer support.</li>
        <li>To send order updates and, with your consent, occasional offers.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We share it only with trusted service providers (such as
        delivery partners and payment processors) to the extent necessary to fulfil your order.
      </p>

      <h2>Your choices</h2>
      <p>
        You can request a copy of your data, ask us to correct it, or request deletion by contacting us at the
        details on our Contact page.
      </p>

      <h2>Contact</h2>
      <p>For any privacy-related questions, please reach out via our Contact page or WhatsApp.</p>
    </LegalPage>
  );
}
