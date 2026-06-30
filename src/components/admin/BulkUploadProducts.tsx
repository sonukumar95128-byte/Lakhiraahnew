"use client";

import { useRef, useState } from "react";
import { categories, productImages, type Category } from "@/lib/dummy-images";
import { downloadCsv, parseCsv } from "@/lib/csv";
import { useAdmin } from "@/lib/admin-store";

const TEMPLATE_HEADERS = ["sku", "name", "category", "price", "stock", "description", "image_urls"];

const TEMPLATE_SAMPLE_ROW = [
  "ALR00390",
  "Aria Halo Diamond Ring",
  "Rings",
  "₹12,499",
  "12",
  "A timeless halo-set diamond ring crafted in 14k gold.",
  "https://example.com/aria-1.jpg;https://example.com/aria-2.jpg",
];

type UploadResult = {
  addedCount: number;
  errors: { row: number; message: string }[];
};

export function BulkUploadButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="rounded-full border border-beige px-5 py-2.5 text-sm text-ink/70 hover:border-gold transition-colors whitespace-nowrap"
    >
      {open ? "Close bulk upload" : "Bulk upload"}
    </button>
  );
}

export function BulkUploadPanel({ open }: { open: boolean }) {
  const { addProduct, products } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const handleDownloadTemplate = () => {
    downloadCsv("lakshiraah-product-upload-template.csv", [TEMPLATE_HEADERS, TEMPLATE_SAMPLE_ROW]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const text = await file.text();
    const rows = parseCsv(text);

    if (rows.length === 0) {
      setResult({ addedCount: 0, errors: [{ row: 0, message: "File is empty." }] });
      setUploading(false);
      return;
    }

    const header = rows[0].map((h) => h.trim().toLowerCase());
    const dataRows = rows.slice(1);
    const errors: UploadResult["errors"] = [];
    let addedCount = 0;

    const col = (row: string[], name: string) => {
      const idx = header.indexOf(name);
      return idx === -1 ? "" : (row[idx] ?? "").trim();
    };

    const existingNames = new Set(products.map((p) => p.name.toLowerCase()));

    dataRows.forEach((row, i) => {
      const rowNum = i + 2; // account for header row + 1-indexing
      const sku = col(row, "sku");
      const name = col(row, "name");
      const categoryRaw = col(row, "category");
      const price = col(row, "price");
      const stockRaw = col(row, "stock");
      const description = col(row, "description");
      const imageUrls = col(row, "image_urls")
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!name) {
        errors.push({ row: rowNum, message: "Missing product name." });
        return;
      }
      if (existingNames.has(name.toLowerCase())) {
        errors.push({ row: rowNum, message: `"${name}" already exists — skipped.` });
        return;
      }
      const category = categories.find((c) => c.toLowerCase() === categoryRaw.toLowerCase()) as
        | Category
        | undefined;
      if (!category) {
        errors.push({
          row: rowNum,
          message: `Unknown category "${categoryRaw}". Must be one of: ${categories.join(", ")}.`,
        });
        return;
      }
      if (!price || !/[0-9]/.test(price)) {
        errors.push({ row: rowNum, message: "Missing or invalid price." });
        return;
      }
      const stock = Number(stockRaw);
      if (Number.isNaN(stock) || stock < 0) {
        errors.push({ row: rowNum, message: "Missing or invalid stock quantity." });
        return;
      }

      const gallery = imageUrls.length > 0 ? imageUrls : [productImages[i % productImages.length]];
      addProduct({
        sku: sku || undefined,
        name,
        category,
        price: price.startsWith("₹") ? price : `₹${price}`,
        stock,
        description: description || `${name} — a beautiful addition to your jewellery collection.`,
        image: gallery[0],
        gallery,
        rating: 4.5,
        reviewCount: 0,
      });
      existingNames.add(name.toLowerCase());
      addedCount++;
    });

    setResult({ addedCount, errors });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-6 rounded-xl border border-beige bg-white p-5">
      <p className="text-sm font-medium text-brand mb-1">Bulk upload products via CSV</p>
      <p className="text-xs text-ink/50 mb-4">
        Columns required: <code className="text-ink/70">{TEMPLATE_HEADERS.join(", ")}</code>. For multiple photos,
        separate URLs in <code className="text-ink/70">image_urls</code> with a semicolon (
        <code className="text-ink/70">img1.jpg;img2.jpg</code>). Download the template below, fill it in, then
        upload it here.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleDownloadTemplate}
          className="rounded-full border border-gold px-4 py-2 text-sm text-brand hover:bg-gold-light/20 transition-colors"
        >
          Download template (.csv)
        </button>

        <label className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors cursor-pointer">
          {uploading ? "Uploading…" : "Choose CSV file"}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {result && (
        <div className="mt-4 text-sm">
          {result.addedCount > 0 && <p className="text-gold mb-2">✓ Added {result.addedCount} product(s).</p>}
          {result.errors.length > 0 && (
            <div className="rounded-lg bg-red-50 px-3 py-2">
              <p className="font-medium text-red-600 mb-1">{result.errors.length} row(s) skipped:</p>
              <ul className="space-y-0.5 text-red-600/90 text-xs">
                {result.errors.map((err, i) => (
                  <li key={i}>
                    Row {err.row}: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.addedCount === 0 && result.errors.length === 0 && (
            <p className="text-ink/50">No rows found in file.</p>
          )}
        </div>
      )}
    </div>
  );
}
