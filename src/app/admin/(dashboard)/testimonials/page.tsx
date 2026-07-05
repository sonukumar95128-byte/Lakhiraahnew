"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useAdmin, type TestimonialStatus } from "@/lib/admin-store";

const statusStyles: Record<TestimonialStatus, string> = {
  pending: "bg-beige text-ink/70",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

function Avatar({ src, name }: { src: string; name: string }) {
  if (src) {
    return (
      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-beige">
        <Image src={src} alt={name} fill sizes="48px" className="object-cover" />
      </div>
    );
  }
  return (
    <div className="h-12 w-12 shrink-0 rounded-full bg-brand/10 flex items-center justify-center text-brand font-medium text-lg">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const { testimonials, setTestimonialStatus, toggleTestimonialFeatured, addTestimonial, deleteTestimonial } =
    useAdmin();
  const [filter, setFilter] = useState<"all" | TestimonialStatus>("all");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = testimonials.filter((t) => filter === "all" || t.status === filter);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "same-origin" });
      const data = await res.json();
      if (res.ok) setAvatar(data.url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    addTestimonial({ name, text, rating, avatar, status: "pending", featured: false });
    setName(""); setText(""); setRating(5); setAvatar(""); setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
          {showForm ? "Cancel" : "+ Add testimonial"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 rounded-xl border border-beige bg-white p-5 space-y-3 max-w-lg">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            required
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Review text"
            rows={3}
            required
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <div className="flex items-center gap-3">
            <Avatar src={avatar} name={name || "?"} />
            <div className="flex-1">
              <label className={
                "flex items-center gap-2 rounded-lg border border-dashed border-beige px-3 py-2 text-sm cursor-pointer hover:border-gold transition-colors " +
                (uploading ? "opacity-60 cursor-not-allowed" : "")
              }>
                {uploading ? "Uploading…" : avatar ? "Change photo" : "Upload photo (optional)"}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleAvatarUpload} />
              </label>
              {avatar && (
                <button type="button" onClick={() => setAvatar("")} className="mt-1 text-xs text-red-400 hover:text-red-600">
                  Remove photo
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-ink/60">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-lg border border-beige px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} ★</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Add (pending review)
          </button>
        </form>
      )}

      <div className="flex items-center gap-2 mb-4">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors " +
              (filter === f ? "bg-brand text-gold-light" : "border border-beige text-ink/60 hover:border-gold")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className="flex items-start gap-4 rounded-xl border border-beige bg-white p-4">
            <Avatar src={t.avatar} name={t.name} />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-brand">{t.name}</p>
                <span className="text-gold text-xs">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</span>
                <span className={"rounded-full px-2 py-0.5 text-xs capitalize " + statusStyles[t.status]}>
                  {t.status}
                </span>
                {t.featured && (
                  <span className="rounded-full bg-gold-light/40 px-2 py-0.5 text-xs text-brand">Featured</span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink/70">{t.text}</p>

              <div className="mt-2 flex items-center gap-3 text-xs">
                {t.status !== "approved" && (
                  <button onClick={() => setTestimonialStatus(t.id, "approved")} className="text-green-600 hover:underline">
                    Approve
                  </button>
                )}
                {t.status !== "rejected" && (
                  <button onClick={() => setTestimonialStatus(t.id, "rejected")} className="text-red-500 hover:underline">
                    Reject
                  </button>
                )}
                <button onClick={() => toggleTestimonialFeatured(t.id)} className="text-gold hover:underline">
                  {t.featured ? "Unfeature" : "Feature"}
                </button>
                <button onClick={() => deleteTestimonial(t.id)} className="text-ink/40 hover:text-red-500">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-beige bg-white p-8 text-center text-sm text-ink/40">
            No testimonials in this filter.
          </p>
        )}
      </div>
    </div>
  );
}
