"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/lib/user-store";

const navItems = [
  { href: "/account", label: "Overview", icon: "⊙" },
  { href: "/account/profile", label: "Profile", icon: "✎" },
  { href: "/account/orders", label: "My Orders", icon: "📦" },
  { href: "/account/addresses", label: "Addresses", icon: "📍" },
  { href: "/account/wishlist", label: "Wishlist", icon: "♡" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          {/* User card */}
          <div className="bg-white rounded-2xl border border-beige p-5 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand/10 grid place-items-center text-brand font-heading italic text-xl shrink-0">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand truncate">{user?.name}</p>
                <p className="text-xs text-ink/50 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="bg-white rounded-2xl border border-beige overflow-hidden">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex items-center gap-3 px-5 py-3.5 text-sm transition-colors border-b border-beige last:border-0 " +
                    (active ? "bg-brand text-gold-light font-medium" : "text-ink/70 hover:bg-beige/40 hover:text-brand")
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={async () => { await logout(); router.push("/"); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <span>→</span> Sign out
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
