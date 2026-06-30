"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categories, type Category } from "@/lib/dummy-images";
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
  const [gallery, setGallery] = useState<string[]>(
    initial?.gallery?.length ? initial.gallery : initial?.image ? [initial.image] : []
  );
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moreInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!initial;
  const primaryImage = gallery[0] ?? "";

  const uploadFile = async (file: File): Promise<string | null> => {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setUploadError(data.error ?? "Upload failed."); return null; }
      return data.url as string;
    } catch {
      setUploadError("Network error — please try again.");
      return null;
    }
  };

  const handlePrimaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadingIdx(0);
    const url = await uploadFile(file);
    if (url) setGallery((prev) => [url, ...prev.slice(1)]);
    setUploadingIdx(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMoreUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadError("");
    for (let i = 0; i < files.length; i++) {
      setUploadingIdx(gallery.length + i);
      const url = await uploadFile(files[i]);
      if (url) setGallery((prev) => [...prev, url]);
    }
    setUploadingIdx(null);
    if (moreInputRef.current) moreInputRef.current.value = "";
  };

  const removeGalleryImage = (idx: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      sku: sku.trim() || undefined,
      name,
      category,
      price,
      description,
      image: primaryImage,
      gallery,
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

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-brand mb-1">
          Product images
          <span className="ml-1 text-xs font-normal text-ink/40">— first photo is the main thumbnail</span>
        </label>

        <div className="mb-2 rounded-lg bg-beige/40 px-3 py-2 text-xs text-ink/60">
          Recommended: <strong>800 × 800 px</strong> square · JPG / PNG / WebP · max 5 MB each
        </div>

        <div className="flex flex-wrap gap-3 mb-3">
          {gallery.map((img, idx) => (
            <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden border-2 border-beige bg-beige">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-0.5 left-0.5 rounded bg-brand/80 px-1 text-[9px] text-gold-light">
                  Main
                </span>
              )}
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="absolute top-0.5 right-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white text-xs hover:bg-red-500"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Upload primary / add more */}
          <label className={
            "flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-beige text-center cursor-pointer hover:border-gold transition-colors " +
            (uploadingIdx !== null ? "opacity-60 cursor-not-allowed" : "")
          }>
            <span className="text-xl">{uploadingIdx !== null ? "⏳" : "+"}</span>
            <span className="text-[10px] text-ink/50 mt-0.5 leading-tight">
              {gallery.length === 0 ? "Add photo" : "Add more"}
            </span>
            <input
              ref={gallery.length === 0 ? fileInputRef : moreInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple={gallery.length > 0}
              onChange={gallery.length === 0 ? handlePrimaryUpload : handleMoreUpload}
              disabled={uploadingIdx !== null}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
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
          disabled={uploadingIdx !== null}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-50 transition-colors"
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
