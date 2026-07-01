"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  collectionImages,
  dummyProducts,
  dummyTestimonials,
  heroSlides,
  productImages,
  slugify,
  type Category,
  type DummyProduct,
} from "@/lib/dummy-images";
import { dummyOrders, type DummyOrder, type OrderStatus } from "@/lib/dummy-orders";

export type AdminProduct = DummyProduct;

export type HomepageSection = {
  id: string;
  label: string;
  meta: string;
  manageLabel: string;
  manageHref?: string;
  enabled: boolean;
};

export type HeroSlideAdmin = {
  id: string;
  title: string;
  link: string;
  image: string;
  enabled: boolean;
};

export type PromoStrip = {
  id: string;
  position: string;
  title: string;
  link: string;
  image: string;
};

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type AdminTestimonial = {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar: string;
  status: TestimonialStatus;
  featured: boolean;
};

export type ProductReview = {
  id: string;
  productSlug: string;
  name: string;
  rating: number;
  text: string;
  status: TestimonialStatus;
  createdAt: string;
};

export type AdminCollection = {
  id: string;
  title: string;
  slug: string;
  image: string;
  productSlugs: string[];
  enabled: boolean;
};

export type CouponType = "percent" | "flat";

export type AdminCoupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderInPaise: number;
  expiresAt: string; // ISO date
  active: boolean;
};

export type SiteSettings = {
  goldRatePerGram: number; // 22kt, ₹/g
  goldRateMode: "auto" | "manual";
  announcementText: string;
  freeShippingThresholdInPaise: number;
  paymentMethods: {
    upi: boolean;
    card: boolean;
    netbanking: boolean;
    cod: boolean;
  };
  gstPercent: number;
};

// v3: bumped after setting all stock to 50 (was 1 each from the CSV).
// Changing this key invalidates any stale browser cache from before that change.
const PRODUCTS_KEY = "lakshiraah-admin-products-v3";
// v2: bumped after removing the 5 sample/dummy orders.
const ORDERS_KEY = "lakshiraah-admin-orders-v2";
// v2: bumped after adding manageHref links to sections.
const HOMEPAGE_KEY = "lakshiraah-admin-homepage-v2";
const BANNERS_KEY = "lakshiraah-admin-banners";
const TESTIMONIALS_KEY = "lakshiraah-admin-testimonials";
// v2: productCount replaced with real productSlugs[] for collection-to-product linking.
const COLLECTIONS_KEY = "lakshiraah-admin-collections-v2";
const COUPONS_KEY = "lakshiraah-admin-coupons";
const SETTINGS_KEY = "lakshiraah-admin-settings";
const PRODUCT_REVIEWS_KEY = "lakshiraah-product-reviews";
const NEW_ARRIVALS_KEY = "lakshiraah-admin-new-arrivals";
const BEST_SELLERS_KEY = "lakshiraah-admin-best-sellers";

const seedProducts: AdminProduct[] = dummyProducts;

const seedHomepageSections: HomepageSection[] = [
  { id: "hero", label: "Hero slider", meta: "3 active slides", manageLabel: "Manage slides →", manageHref: "/admin/banners", enabled: true },
  { id: "categories", label: "Category circles", meta: "auto from categories", manageLabel: "Pick categories →", enabled: true },
  { id: "new-arrivals", label: "New Arrivals", meta: "8 products shown", manageLabel: "Choose products →", manageHref: "/admin/homepage/new-arrivals", enabled: true },
  { id: "offer-banner", label: "Offer banner", meta: "links to /offers", manageLabel: "Edit banner & link →", manageHref: "/admin/banners", enabled: true },
  { id: "best-sellers", label: "Best Sellers", meta: "8 products shown", manageLabel: "Choose products →", manageHref: "/admin/homepage/best-sellers", enabled: true },
  { id: "reels", label: "Styling reels", meta: "9 reels · shows 4", manageLabel: "Manage reels →", enabled: true },
  { id: "collections", label: "Shop by collection", meta: "3 collections", manageLabel: "Choose collections →", manageHref: "/admin/collections", enabled: true },
  { id: "testimonials", label: "Testimonials", meta: "3 approved", manageLabel: "Manage testimonials →", manageHref: "/admin/testimonials", enabled: true },
  { id: "trust-badges", label: "Trust badges", meta: "4 badges", manageLabel: "Edit badges →", enabled: false },
];

const seedHeroSlides: HeroSlideAdmin[] = heroSlides.map((s, i) => ({
  id: `slide-${i + 1}`,
  title: s.alt,
  link: s.href,
  image: s.image,
  enabled: true,
}));

const seedPromoStrips: PromoStrip[] = [
  { id: "top-of-home", position: "Top of home", title: "Festive sale — flat 20% off", link: "/jewellery?offer=true", image: productImages[6] },
  { id: "mid-home", position: "Mid home", title: "Buy 2 get free gold polish", link: "/jewellery", image: productImages[2] },
];

const seedTestimonials: AdminTestimonial[] = dummyTestimonials.map((t, i) => ({
  id: `testimonial-${i + 1}`,
  name: t.name,
  rating: t.rating,
  text: t.text,
  avatar: t.avatar,
  status: "approved",
  featured: i === 0,
}));

const seedCollections: AdminCollection[] = [
  {
    id: "bridal",
    title: "Bridal",
    slug: "bridal",
    image: collectionImages.Bridal,
    productSlugs: dummyProducts.slice(0, 8).map((p) => p.slug),
    enabled: true,
  },
  {
    id: "everyday-light",
    title: "Everyday Light",
    slug: "everyday-light",
    image: collectionImages["Everyday Light"],
    productSlugs: dummyProducts.slice(8, 16).map((p) => p.slug),
    enabled: true,
  },
  {
    id: "gifting",
    title: "Gifting",
    slug: "gifting",
    image: collectionImages.Gifting,
    productSlugs: dummyProducts.slice(16, 24).map((p) => p.slug),
    enabled: true,
  },
];

const seedCoupons: AdminCoupon[] = [
  {
    id: "coupon-1",
    code: "JB50",
    type: "percent",
    value: 8,
    minOrderInPaise: 0,
    expiresAt: "2026-12-31",
    active: true,
  },
  {
    id: "coupon-2",
    code: "DAZZLING20",
    type: "percent",
    value: 5,
    minOrderInPaise: 0,
    expiresAt: "2026-12-31",
    active: true,
  },
  {
    id: "coupon-3",
    code: "WELCOME200",
    type: "flat",
    value: 20000,
    minOrderInPaise: 500000,
    expiresAt: "2026-09-30",
    active: false,
  },
];

// Defaults when the admin hasn't picked a manual selection yet — first 8 vs next 8 products.
const seedNewArrivals: string[] = dummyProducts.slice(0, 8).map((p) => p.slug);
const seedBestSellers: string[] = dummyProducts.slice(8, 16).map((p) => p.slug);

const seedSettings: SiteSettings = {
  goldRatePerGram: 7128,
  goldRateMode: "auto",
  announcementText: "Free shipping over ₹999 · Today's gold rate ₹7,128/g · Easy 15-day returns",
  freeShippingThresholdInPaise: 99900,
  paymentMethods: { upi: true, card: true, netbanking: true, cod: true },
  gstPercent: 3,
};

type AdminContextValue = {
  products: AdminProduct[];
  addProduct: (product: Omit<AdminProduct, "slug">) => void;
  updateProduct: (slug: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (slug: string) => void;
  getProduct: (slug: string) => AdminProduct | undefined;

  orders: DummyOrder[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  homepageSections: HomepageSection[];
  toggleHomepageSection: (id: string) => void;
  reorderHomepageSections: (sections: HomepageSection[]) => void;

  heroSlidesAdmin: HeroSlideAdmin[];
  addHeroSlide: () => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlideAdmin>) => void;
  toggleHeroSlide: (id: string) => void;
  deleteHeroSlide: (id: string) => void;

  promoStrips: PromoStrip[];
  updatePromoStrip: (id: string, updates: Partial<PromoStrip>) => void;

  testimonials: AdminTestimonial[];
  setTestimonialStatus: (id: string, status: TestimonialStatus) => void;
  toggleTestimonialFeatured: (id: string) => void;
  addTestimonial: (testimonial: Omit<AdminTestimonial, "id">) => void;
  deleteTestimonial: (id: string) => void;

  collections: AdminCollection[];
  addCollection: () => void;
  updateCollection: (id: string, updates: Partial<AdminCollection>) => void;
  toggleCollection: (id: string) => void;
  deleteCollection: (id: string) => void;

  coupons: AdminCoupon[];
  addCoupon: () => void;
  updateCoupon: (id: string, updates: Partial<AdminCoupon>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;

  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;

  productReviews: ProductReview[];
  addProductReview: (review: Omit<ProductReview, "id" | "status" | "createdAt">) => void;
  setProductReviewStatus: (id: string, status: TestimonialStatus) => void;
  deleteProductReview: (id: string) => void;
  getApprovedReviews: (productSlug: string) => ProductReview[];

  newArrivalsSlugs: string[];
  setNewArrivalsSlugs: (slugs: string[]) => void;
  bestSellersSlugs: string[];
  setBestSellersSlugs: (slugs: string[]) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(seedProducts);
  const [orders, setOrders] = useState<DummyOrder[]>(dummyOrders);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>(seedHomepageSections);
  const [heroSlidesAdmin, setHeroSlidesAdmin] = useState<HeroSlideAdmin[]>(seedHeroSlides);
  const [promoStrips, setPromoStrips] = useState<PromoStrip[]>(seedPromoStrips);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(seedTestimonials);
  const [collections, setCollections] = useState<AdminCollection[]>(seedCollections);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(seedCoupons);
  const [settings, setSettings] = useState<SiteSettings>(seedSettings);
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  const [newArrivalsSlugs, setNewArrivalsSlugs] = useState<string[]>(seedNewArrivals);
  const [bestSellersSlugs, setBestSellersSlugs] = useState<string[]>(seedBestSellers);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Phase 1: restore from localStorage immediately (fast, works offline)
    try {
      const rawProducts = localStorage.getItem(PRODUCTS_KEY);
      if (rawProducts) setProducts(JSON.parse(rawProducts));
      const rawOrders = localStorage.getItem(ORDERS_KEY);
      if (rawOrders) setOrders(JSON.parse(rawOrders));
      const rawHomepage = localStorage.getItem(HOMEPAGE_KEY);
      if (rawHomepage) setHomepageSections(JSON.parse(rawHomepage));
      const rawBanners = localStorage.getItem(BANNERS_KEY);
      if (rawBanners) {
        const parsed = JSON.parse(rawBanners);
        if (parsed.heroSlidesAdmin) setHeroSlidesAdmin(parsed.heroSlidesAdmin);
        if (parsed.promoStrips) setPromoStrips(parsed.promoStrips);
      }
      const rawTestimonials = localStorage.getItem(TESTIMONIALS_KEY);
      if (rawTestimonials) setTestimonials(JSON.parse(rawTestimonials));
      const rawCollections = localStorage.getItem(COLLECTIONS_KEY);
      if (rawCollections) setCollections(JSON.parse(rawCollections));
      const rawCoupons = localStorage.getItem(COUPONS_KEY);
      if (rawCoupons) setCoupons(JSON.parse(rawCoupons));
      const rawSettings = localStorage.getItem(SETTINGS_KEY);
      if (rawSettings) setSettings(JSON.parse(rawSettings));
      const rawProductReviews = localStorage.getItem(PRODUCT_REVIEWS_KEY);
      if (rawProductReviews) setProductReviews(JSON.parse(rawProductReviews));
      const rawNewArrivals = localStorage.getItem(NEW_ARRIVALS_KEY);
      if (rawNewArrivals) setNewArrivalsSlugs(JSON.parse(rawNewArrivals));
      const rawBestSellers = localStorage.getItem(BEST_SELLERS_KEY);
      if (rawBestSellers) setBestSellersSlugs(JSON.parse(rawBestSellers));
    } catch {
      // ignore malformed storage
    }

    // Phase 2: overwrite with DB values (server-persisted, wins over stale localStorage)
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((db: Record<string, unknown>) => {
        if (!db) return;
        if (db.banners) {
          const b = db.banners as { heroSlidesAdmin?: typeof seedHeroSlides; promoStrips?: typeof seedPromoStrips };
          if (b.heroSlidesAdmin) setHeroSlidesAdmin(b.heroSlidesAdmin);
          if (b.promoStrips) setPromoStrips(b.promoStrips);
        }
        if (db.homepage) setHomepageSections(db.homepage as typeof seedHomepageSections);
        if (db.testimonials) setTestimonials(db.testimonials as typeof seedTestimonials);
        if (db.collections) setCollections(db.collections as typeof seedCollections);
        if (db.coupons) setCoupons(db.coupons as typeof seedCoupons);
        if (db.settings) setSettings(db.settings as typeof seedSettings);
        if (db.newArrivals) setNewArrivalsSlugs(db.newArrivals as string[]);
        if (db.bestSellers) setBestSellersSlugs(db.bestSellers as string[]);
        if (db.productReviews) setProductReviews(db.productReviews as typeof seedTestimonials);
      })
      .catch(() => { /* DB not available — localStorage values stay */ })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(homepageSections));
  }, [homepageSections, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(BANNERS_KEY, JSON.stringify({ heroSlidesAdmin, promoStrips }));
  }, [heroSlidesAdmin, promoStrips, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
  }, [testimonials, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }, [collections, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  }, [coupons, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PRODUCT_REVIEWS_KEY, JSON.stringify(productReviews));
  }, [productReviews, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(NEW_ARRIVALS_KEY, JSON.stringify(newArrivalsSlugs));
  }, [newArrivalsSlugs, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(BEST_SELLERS_KEY, JSON.stringify(bestSellersSlugs));
  }, [bestSellersSlugs, hydrated]);

  // Sync to DB (fire-and-forget — never blocks the UI)
  const syncDb = (key: string, value: unknown) => {
    fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    }).catch(() => { /* silently ignore if DB unreachable */ });
  };

  useEffect(() => { if (hydrated) syncDb("banners", { heroSlidesAdmin, promoStrips }); }, [heroSlidesAdmin, promoStrips, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("homepage", homepageSections); }, [homepageSections, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("testimonials", testimonials); }, [testimonials, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("collections", collections); }, [collections, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("coupons", coupons); }, [coupons, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("settings", settings); }, [settings, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("newArrivals", newArrivalsSlugs); }, [newArrivalsSlugs, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("bestSellers", bestSellersSlugs); }, [bestSellersSlugs, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (hydrated) syncDb("productReviews", productReviews); }, [productReviews, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const addProductReview = (review: Omit<ProductReview, "id" | "status" | "createdAt">) => {
    setProductReviews((prev) => [
      {
        ...review,
        id: `review-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const setProductReviewStatus = (id: string, status: TestimonialStatus) => {
    setProductReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const deleteProductReview = (id: string) => {
    setProductReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const getApprovedReviews = (productSlug: string) =>
    productReviews.filter((r) => r.productSlug === productSlug && r.status === "approved");

  const addProduct = (product: Omit<AdminProduct, "slug">) => {
    setProducts((prev) => {
      const base = slugify(product.name);
      let slug = base;
      let n = 2;
      while (prev.some((p) => p.slug === slug)) {
        slug = `${base}-${n}`;
        n++;
      }
      return [{ ...product, slug }, ...prev];
    });
  };

  const updateProduct = (slug: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (slug: string) => {
    setProducts((prev) => prev.filter((p) => p.slug !== slug));
  };

  const getProduct = (slug: string) => products.find((p) => p.slug === slug);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const toggleHomepageSection = (id: string) => {
    setHomepageSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const reorderHomepageSections = (sections: HomepageSection[]) => {
    setHomepageSections(sections);
  };

  const addHeroSlide = () => {
    const id = `slide-${Date.now()}`;
    setHeroSlidesAdmin((prev) => [
      ...prev,
      { id, title: "New slide", link: "/jewellery", image: productImages[0], enabled: true },
    ]);
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlideAdmin>) => {
    setHeroSlidesAdmin((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const toggleHeroSlide = (id: string) => {
    setHeroSlidesAdmin((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlidesAdmin((prev) => prev.filter((s) => s.id !== id));
  };

  const updatePromoStrip = (id: string, updates: Partial<PromoStrip>) => {
    setPromoStrips((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const setTestimonialStatus = (id: string, status: TestimonialStatus) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const toggleTestimonialFeatured = (id: string) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)));
  };

  const addTestimonial = (testimonial: Omit<AdminTestimonial, "id">) => {
    setTestimonials((prev) => [{ ...testimonial, id: `testimonial-${Date.now()}` }, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const addCollection = () => {
    const id = `collection-${Date.now()}`;
    setCollections((prev) => [
      ...prev,
      { id, title: "New collection", slug: slugify("New collection"), image: productImages[0], productSlugs: [], enabled: true },
    ]);
  };

  const updateCollection = (id: string, updates: Partial<AdminCollection>) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const toggleCollection = (id: string) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const addCoupon = () => {
    const id = `coupon-${Date.now()}`;
    setCoupons((prev) => [
      ...prev,
      { id, code: "NEWCODE", type: "percent", value: 10, minOrderInPaise: 0, expiresAt: "2026-12-31", active: true },
    ]);
  };

  const updateCoupon = (id: string, updates: Partial<AdminCoupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        orders,
        updateOrderStatus,
        homepageSections,
        toggleHomepageSection,
        reorderHomepageSections,
        heroSlidesAdmin,
        addHeroSlide,
        updateHeroSlide,
        toggleHeroSlide,
        deleteHeroSlide,
        promoStrips,
        updatePromoStrip,
        testimonials,
        setTestimonialStatus,
        toggleTestimonialFeatured,
        addTestimonial,
        deleteTestimonial,
        collections,
        addCollection,
        updateCollection,
        toggleCollection,
        deleteCollection,
        coupons,
        addCoupon,
        updateCoupon,
        toggleCoupon,
        deleteCoupon,
        settings,
        updateSettings,
        productReviews,
        addProductReview,
        setProductReviewStatus,
        deleteProductReview,
        getApprovedReviews,
        newArrivalsSlugs,
        setNewArrivalsSlugs,
        bestSellersSlugs,
        setBestSellersSlugs,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
}

export type { Category };
