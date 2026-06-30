import type { MetadataRoute } from "next";
import { categories, categoryToSlug, dummyProducts } from "@/lib/dummy-images";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/jewellery",
    "/about",
    "/privacy",
    "/terms",
    "/help/shipping-returns",
    "/help/size-guide",
    "/help/care-warranty",
    "/help/contact",
    "/store-locator",
    "/collections",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const categoryPages = categories.map((c) => ({
    url: `${baseUrl}/jewellery/${categoryToSlug(c)}`,
    lastModified: new Date(),
  }));

  const productPages = dummyProducts.map((p) => ({
    url: `${baseUrl}/jewellery/${categoryToSlug(p.category)}/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
