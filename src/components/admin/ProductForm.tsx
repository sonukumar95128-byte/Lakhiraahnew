"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, productImages, type Category } from "@/lib/dummy-images";
import { useAdmin, type AdminProduct } from "@/lib/admin-store";

type ProductFormProps = {
  initial?: AdminProduct;
};

export function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct } = useAdmin();

  const [sku, setSku] = useState(initial?.sku ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? categories[0]);
  const [price, setPrice] = useState(initial?.price ?? "");
  const [stock, setStock] = useState(initial?.stock ?? 10);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? productImages[0]);

  const isEdit = !!initial;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      sku: sku.trim() || undefined,
      name,
      category,
      price,
      description,
      image,
      gallery: initial?.gallery ?? [image],
      stock,
      rating: initial?.rating ?? 4.5,
      reviewCount: initial?.reviewCount ?? 0,
      originalPrice: initial?.originalPrice,
      attributes: initial?.attributes,
    };

    if (isEdit && initial) {
      updateProduct(initial.slug, payload);
    } else {
      addProduct(payload);
    }

    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-brand mb-1">SKU</label>
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value.toUpperCase())}
          placeholder="e.g. ALR00390"
          className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <p className="mt-1 text-xs text-ink/40">Use the original SKU from your catalog/supplier, if you have one.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand mb-1">Stock</label>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
            className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand mb-1">Price (e.g. ₹4,999)</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand mb-1">Image</label>
        <div className="flex gap-2 flex-wrap">
          {productImages.map((img) => (
            <button
              key={img}
              type="button"
              onClick={() => setImage(img)}
              className={
                "h-14 w-14 rounded-lg overflow-hidden border-2 bg-beige " +
                (image === img ? "border-gold" : "border-transparent")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
          {isEdit ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-beige px-6 py-2.5 text-sm text-ink/70 hover:border-gold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
