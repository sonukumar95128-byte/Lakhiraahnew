import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart-store";
import { AdminProvider } from "@/lib/admin-store";
import { WishlistProvider } from "@/lib/wishlist-store";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Lakshiraah — Luxurious Concepts",
    template: "%s",
  },
  description: "Fine jewellery — rings, earrings, necklaces, bracelets, and nose pins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <AdminProvider>
          <CartProvider>
            <WishlistProvider>
              <SiteChrome>{children}</SiteChrome>
            </WishlistProvider>
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
