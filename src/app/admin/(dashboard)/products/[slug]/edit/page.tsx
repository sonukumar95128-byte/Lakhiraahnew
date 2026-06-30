"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdmin } from "@/lib/admin-store";

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getProduct } = useAdmin();
  const product = getProduct(slug);

  if (!product) {
    return (
      <div>
        <h1 className="font-heading italic text-3xl text-brand mb-6">Product not found</h1>
        <p className="text-sm text-ink/60">It may have been deleted.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading italic text-3xl text-brand mb-6">Edit product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
