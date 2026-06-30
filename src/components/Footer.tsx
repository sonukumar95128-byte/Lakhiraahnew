import Image from "next/image";
import Link from "next/link";

const shopLinks = ["Rings", "Earrings", "Necklaces", "Bracelets", "Pendants", "Nose Pins"];
const helpLinks = [
  { label: "Track order", href: "/account/orders" },
  { label: "Shipping & returns", href: "/help/shipping-returns" },
  { label: "Size guide", href: "/help/size-guide" },
  { label: "Care & warranty", href: "/help/care-warranty" },
  { label: "Contact us", href: "/help/contact" },
];
const companyLinks = [
  { label: "About Lakshiraah", href: "/about" },
  { label: "Store locator", href: "/store-locator" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2H15l-.5 3H11.5v6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M7 17l-3 1 1-3a7.5 7.5 0 1 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 9.5c0 2.5 2.5 5 5 5 .5-1 .5-1.5 0-2l-1.5-.5-1 1c-1-.5-2-1.5-2.5-2.5l1-1-.5-1.5c-.5-.5-1-.5-2 0z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-brand text-gold-light/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <Image
            src="/brand/lakshiraah-logo.png"
            alt="Lakshiraah"
            width={220}
            height={60}
            className="h-16 w-auto object-contain mb-3"
          />
          <p className="text-xs text-gold-light/60 leading-relaxed">
            Luxurious concepts in fine jewellery — handcrafted, hallmarked, and certified.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center rounded-full border border-gold-light/30 text-gold-light/80 hover:border-gold hover:text-gold transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-3 text-gold-light">Shop</h4>
          <ul className="space-y-2 text-sm text-gold-light/70">
            {shopLinks.map((l) => (
              <li key={l}>
                <Link href={`/jewellery/${l.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-gold">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-3 text-gold-light">Help</h4>
          <ul className="space-y-2 text-sm text-gold-light/70">
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-3 text-gold-light">Company</h4>
          <ul className="space-y-2 text-sm text-gold-light/70">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-light/15 px-4 sm:px-6 py-4 text-center text-xs text-gold-light/50">
        © {new Date().getFullYear()} Lakshiraah. All rights reserved.
      </div>
    </footer>
  );
}
