"use client";

import { ProductPicker } from "@/components/admin/ProductPicker";
import { useAdmin } from "@/lib/admin-store";

export default function BestSellersPickerPage() {
  const { bestSellersSlugs, setBestSellersSlugs } = useAdmin();

  return (
    <ProductPicker
      title="Best Sellers — choose products"
      description="Pick which products show in the homepage Best Sellers section, and reorder with the arrows. Mix any categories you like."
      initialSelected={bestSellersSlugs}
      onSave={setBestSellersSlugs}
      backHref="/admin/homepage"
    />
  );
}
