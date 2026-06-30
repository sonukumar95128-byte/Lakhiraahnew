"use client";

import { useParams } from "next/navigation";
import { ProductPicker } from "@/components/admin/ProductPicker";
import { useAdmin } from "@/lib/admin-store";

export default function CollectionProductsPickerPage() {
  const { id } = useParams<{ id: string }>();
  const { collections, updateCollection } = useAdmin();
  const collection = collections.find((c) => c.id === id);

  if (!collection) {
    return (
      <div>
        <h1 className="font-heading italic text-3xl text-brand mb-3">Collection not found</h1>
        <p className="text-sm text-ink/60">It may have been deleted.</p>
      </div>
    );
  }

  return (
    <ProductPicker
      title={`${collection.title} — choose products`}
      description="Pick which products appear in this collection. Mix any categories you like."
      initialSelected={collection.productSlugs}
      onSave={(slugs) => updateCollection(collection.id, { productSlugs: slugs })}
      backHref="/admin/collections"
    />
  );
}
