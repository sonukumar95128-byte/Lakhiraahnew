// Marketing imagery (hero/banners/collections) stays as Unsplash placeholders until real lifestyle shots are supplied.
// Real catalog product data/photos are generated from the CSV export — see src/lib/real-products.ts.
import { realProducts } from "@/lib/real-products";

export const categoryImages: Record<string, string> = {
  Rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop",
  Earrings: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop",
  Necklaces: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop",
  Bracelets: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop",
  Pendants: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop",
  "Nose Pins": "https://images.unsplash.com/photo-1631214524115-de7188ff5402?w=300&h=300&fit=crop",
};

export const categoryBannerImages: Record<string, string> = {
  Rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&h=500&fit=crop",
  Earrings: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&h=500&fit=crop",
  Necklaces: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&h=500&fit=crop",
  Bracelets: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&h=500&fit=crop",
  Pendants: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&h=500&fit=crop",
  "Nose Pins": "https://images.unsplash.com/photo-1631214524115-de7188ff5402?w=1600&h=500&fit=crop",
};

export const heroImage =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&h=700&fit=crop";

export const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&h=700&fit=crop",
    href: "/jewellery",
    alt: "New arrivals",
  },
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&h=700&fit=crop",
    href: "/collections/bridal",
    alt: "Bridal collection",
  },
  {
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&h=700&fit=crop",
    href: "/jewellery/rings",
    alt: "Rings collection",
  },
];

export const promoImage =
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&h=500&fit=crop";

export const collectionImages: Record<string, string> = {
  Bridal: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=450&fit=crop",
  "Everyday Light": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=450&fit=crop",
  Gifting: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=450&fit=crop",
};

export const productImages = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=500&h=500&fit=crop",
];

export type DummyTestimonial = {
  name: string;
  rating: number;
  text: string;
  avatar: string;
  verified: boolean;
};

export const dummyTestimonials: DummyTestimonial[] = [
  {
    name: "Aarohi Mehta",
    rating: 5,
    text: "The ring exceeded my expectations — the craftsmanship is stunning and it arrived beautifully packaged. Customer service was wonderful throughout.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    verified: true,
  },
  {
    name: "Priya Nair",
    rating: 4,
    text: "Gorgeous earrings, exactly like the pictures. Delivery was quick and the 15-day return policy gave me peace of mind.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    verified: true,
  },
  {
    name: "Kavya Reddy",
    rating: 5,
    text: "Bought this necklace for my anniversary and it's even more beautiful in person. The hallmark certification made me trust the purchase completely.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
    verified: true,
  },
];

export const categories = ["Rings", "Earrings", "Necklaces", "Bracelets", "Pendants", "Nose Pins"] as const;
export type Category = (typeof categories)[number];

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategory(slug: string): Category | undefined {
  return categories.find((c) => categoryToSlug(c) === slug);
}

export type DummyProduct = {
  sku?: string;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string;
  image: string;
  gallery: string[];
  category: Category;
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
  attributes?: Record<string, string>;
};

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const dummyProducts: DummyProduct[] = realProducts.map((p) => ({
  sku: p.sku,
  name: p.name,
  slug: p.slug,
  price: p.price,
  originalPrice: p.originalPrice,
  image: p.image,
  gallery: p.gallery,
  category: p.category,
  stock: p.stock,
  rating: p.rating,
  reviewCount: p.reviewCount,
  description: p.description,
  attributes: p.attributes,
}));

export function getProductBySlug(slug: string): DummyProduct | undefined {
  return dummyProducts.find((p) => p.slug === slug);
}

export const metalOptions = ["Gold 14k", "Rose 14k", "Silver"];

// Variant selectors for the product detail page
export const colorOptions: { label: string; swatch: string }[] = [
  { label: "Rose", swatch: "#e6b8a2" },
  { label: "White", swatch: "#d9d9d9" },
  { label: "Yellow", swatch: "#d4a24c" },
];

export const purityOptions = ["9kt Gold", "14kt Gold", "18kt Gold"];

export function getSizeOptions(category: Category): string[] {
  switch (category) {
    case "Rings":
      return ["6", "7", "8", "9", "10", "11", "12"];
    case "Bracelets":
      return ["S", "M", "L"];
    case "Necklaces":
    case "Pendants":
      return ["16in", "18in", "20in"];
    default:
      return [];
  }
}

export type PriceBreakup = {
  gold: number;
  diamond: number;
  otherStones: number;
  making: number;
  gst: number;
  total: number;
};

export function getPriceBreakup(price: string): PriceBreakup {
  const total = priceToNumber(price);
  const gold = Math.round(total * 0.62);
  const diamond = Math.round(total * 0.27);
  const otherStones = Math.round(total * 0.02);
  const making = Math.round(total * 0.06);
  const gst = total - gold - diamond - otherStones - making;
  return { gold, diamond, otherStones, making, gst, total };
}

export type Coupon = { code: string; discountInPaise: number; label: string };

export function getCoupons(price: string): Coupon[] {
  const total = priceToNumber(price);
  return [
    { code: "JB50", discountInPaise: Math.round(total * 0.08), label: "Flat 8% off on prepaid orders" },
    { code: "DAZZLING20", discountInPaise: Math.round(total * 0.05), label: "Flat 5% off, no minimum order value" },
  ];
}

export function getCategoryTags(category: Category): string[] {
  const base: Record<Category, string[]> = {
    Rings: ["Everyday Rings", "Band Rings", "Rings"],
    Earrings: ["Stud Earrings", "Drop Earrings", "Earrings"],
    Necklaces: ["Layered Necklaces", "Chokers", "Necklaces"],
    Bracelets: ["Bangles", "Tennis Bracelets", "Bracelets"],
    Pendants: ["Solitaire Pendants", "Fashion Pendants", "Pendants"],
    "Nose Pins": ["Screw Nose Pins", "Press Nose Pins", "Nose Pins"],
  };
  return base[category];
}

export const styleTags = [
  "Women",
  "Desk to Dinner",
  "Everyday wear",
  "Work wear",
  "Evening wear",
  "Party wear",
  "Gifting",
  "Bestsellers",
  "Designer",
  "Everyday Classic",
];

export function priceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""));
}

export function formatRupee(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function getPriceRange(products: DummyProduct[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const values = products.map((p) => priceToNumber(p.price));
  return { min: Math.min(...values), max: Math.max(...values) };
}
