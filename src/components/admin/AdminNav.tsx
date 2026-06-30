"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Dashboard", icon: "▦", href: "/admin" },
  { label: "Products", icon: "▢", href: "/admin/products" },
  { label: "Orders", icon: "🛍", href: "/admin/orders" },
  { label: "Homepage", icon: "▭", href: "/admin/homepage" },
  { label: "Banners", icon: "▥", href: "/admin/banners" },
  { label: "Offers & coupons", icon: "%", href: "/admin/offers" },
  { label: "Testimonials", icon: "★", href: "/admin/testimonials" },
  { label: "Product Reviews", icon: "✎", href: "/admin/reviews" },
  { label: "Collections", icon: "▤", href: "/admin/collections" },
  { label: "Customers", icon: "◔", href: "/admin/customers" },
  { label: "Settings", icon: "⚙", href: "/admin/settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navLinks.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors " +
              (active ? "bg-gold-light/15 text-gold-light font-medium" : "text-gold-light/60 hover:bg-brand-secondary hover:text-gold-light")
            }
          >
            <span className="w-4 text-center text-xs">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
