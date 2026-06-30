## Lakshiraah — Jewellery Ecommerce

Stack: Next.js (App Router, TypeScript) + Tailwind + Prisma/MySQL (Hostinger) + Razorpay (planned) + WhatsApp ordering (current).

### Current status

- **Storefront**: home, category/shop listing, product detail (196 real products with real photos), cart, checkout, search, wishlist — all built and working.
- **Admin panel** (`/admin`, password-gated): products (CRUD + bulk CSV upload), orders, homepage builder, banners, offers/coupons, testimonials, product reviews, collections, customers, settings.
- **Data layer**: the site currently runs entirely on in-memory/`localStorage`-backed data (`src/lib/dummy-images.ts`, `src/lib/admin-store.tsx`) — **not yet connected to the database**. The Prisma schema and client are set up and ready, but no page queries them yet.
- **Checkout**: real payment (Razorpay) isn't wired up yet — orders currently go out via a pre-filled WhatsApp message instead.

### 1. Database (Hostinger MySQL)

1. In hPanel → **Databases → MySQL Databases**, create a database and a user.
2. If connecting from outside Hostinger (e.g. local dev), enable **Remote MySQL** and allow your IP.
3. Copy `.env.example` to `.env` and set `DATABASE_URL`:
   ```
   DATABASE_URL="mysql://user:password@host:3306/dbname"
   ```

### 2. Install & generate

```bash
npm install
npx prisma migrate dev --name init   # creates tables from prisma/schema.prisma
```

### 3. Payments & WhatsApp

Fill in the rest of `.env`:

- `NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER` — your real WhatsApp Business number (country code + number, no `+`/spaces), used as the checkout fallback
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from the [Razorpay dashboard](https://dashboard.razorpay.com/app/keys), once you're ready to enable real payments
- `ADMIN_PASSWORD` — shared password for `/admin` until real admin auth is built
- `NEXT_PUBLIC_SITE_URL` — your production domain, used for `sitemap.xml` and SEO metadata

### 4. Run

```bash
npm run dev
```

### Project structure

```
prisma/schema.prisma     # User, Product, ProductVariant, Cart, Order, Address (MySQL) — not yet wired to pages
src/lib/prisma.ts         # Prisma client (mariadb driver adapter)
src/lib/dummy-images.ts   # Real product catalog (196 products) + marketing placeholder images — current data source
src/lib/admin-store.tsx   # Admin-editable data (products, orders, homepage config, etc.) — localStorage-backed
src/lib/cart-store.tsx    # Cart state — localStorage-backed
src/lib/wishlist-store.tsx# Wishlist state — localStorage-backed
src/app/                  # storefront pages (home, /jewellery, /cart, /checkout, /search, /collections, legal pages)
src/app/admin/            # password-gated admin panel
src/app/api/admin/        # admin login/logout routes
public/products/          # real product photos (~276MB, 628 images)
```

### Known gaps / next steps

- Connect the real database — replace `dummy-images.ts`/`admin-store.tsx` with Prisma queries against MySQL.
- Real customer accounts (login/signup) — currently no auth.
- Real Razorpay payment flow — currently WhatsApp-only.
- Live gold-rate API integration (Settings has an "Auto" toggle with no live source yet).
- Order confirmation emails.
