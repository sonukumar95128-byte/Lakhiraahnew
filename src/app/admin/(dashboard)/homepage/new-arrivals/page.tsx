"use client";

import { ProductPicker } from "@/components/admin/ProductPicker";
import { useAdmin } from "@/lib/admin-store";

export default function NewArrivalsPickerPage() {
  const { newArrivalsSlugs, setNewArrivalsSlugs } = useAdmin();

  return (
    <ProductPicker
      title="New Arrivals — choose products"
      description="Pick which products show in the homepage New Arrivals section, and drag the order with the arrows. Mix any categories you like."
      initialSelected={newArrivalsSlugs}
      onSave={setNewArrivalsSlugs}
      backHref="/admin/homepage"
    />
  );
}
