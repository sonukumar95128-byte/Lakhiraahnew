"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

const navLinks = [
  { label: "Shop", href: "/jewellery" },
  { label: "Rings", href: "/jewellery/rings" },
  { label: "Earrings", href: "/jewellery/earrings" },
  { label: "Necklaces", href: "/jewellery/necklaces" },
  { label: "Bracelets", href: "/jewellery/bracelets" },
  { label: "Pendants", href: "/jewellery/pendants" },
  { label: "Nose Pins", href: "/jewellery/nose-pins" },
];

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20.5s-7.5-4.6-9.8-9.1C.6 8 2 4.5 5.4 3.7c2.1-.5 4.2.3 5.6 2.1l1 1.3 1-1.3c1.4-1.8 3.5-2.6 5.6-2.1 3.4.8 4.8 4.3 3.2 7.7-2.3 4.5-9.8 9.1-9.8 9.1z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l1 13H5L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-3.5 5-5 7.5-5s6 1.5 7.5 5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [hidden, setHidden] = useState(false);
  const [scrolledUp, setScrolledUp] = useState(false);
  const lastY = useRef(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;

      setHidden(goingDown && y > 80);
      setScrolledUp(!goingDown && y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = scrolledUp;

  return (
    <header
      className={
        "sticky top-0 z-50 transition-all duration-300 " +
        (hidden ? "-translate-y-full" : "translate-y-0") +
        " " +
        (dark ? "bg-brand border-b border-gold-light/15 shadow-md" : "bg-white border-b border-beige")
      }
    >
      <div className="mx-auto max-w-7xl grid grid-cols-[auto_1fr_auto] items-center gap-6 px-4 sm:px-6 py-3">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/lakshiraah-logo.png"
            alt="Lakshiraah — Luxurious Concepts"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav
          className={
            "hidden md:flex items-center justify-center gap-8 text-sm font-medium transition-colors " +
            (dark ? "text-gold-light" : "text-ink")
          }
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <span
              className={
                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 " +
                (dark ? "text-gold-light/50" : "text-ink/40")
              }
            >
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={
                "w-44 rounded-full border pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-colors " +
                (dark
                  ? "border-gold-light/25 bg-brand-secondary/40 text-gold-light placeholder:text-gold-light/40"
                  : "border-beige bg-ivory text-ink placeholder:text-ink/40")
              }
            />
          </form>
          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className={
              "relative grid h-9 w-9 place-items-center rounded-full border transition-colors hover:border-gold hover:text-gold " +
              (dark ? "border-gold-light/25 text-gold-light/80" : "border-beige text-ink/70")
            }
          >
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-medium text-brand">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className={
              "relative grid h-9 w-9 place-items-center rounded-full border transition-colors hover:border-gold hover:text-gold " +
              (dark ? "border-gold-light/25 text-gold-light/80" : "border-beige text-ink/70")
            }
          >
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-medium text-brand">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className={
              "grid h-9 w-9 place-items-center rounded-full border transition-colors hover:border-gold hover:text-gold " +
              (dark ? "border-gold-light/25 text-gold-light/80" : "border-beige text-ink/70")
            }
          >
            <UserIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}
