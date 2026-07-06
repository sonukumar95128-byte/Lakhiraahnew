"use client";

import { useRef, useState } from "react";
import { useAdmin } from "@/lib/admin-store";

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function AdminReelsPage() {
  const { reels, addReel, updateReel, toggleReel, deleteReel } = useAdmin();
  const [uploading, setUploading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const uploadVideo = async (reelId: string, file: File) => {
    setUploading(reelId);
    setErrors((e) => ({ ...e, [reelId]: "" }));
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "same-origin" });
      const data = await res.json();
      if (!res.ok) {
        setErrors((e) => ({ ...e, [reelId]: data.error ?? "Upload failed" }));
      } else {
        updateReel(reelId, { videoUrl: data.url });
      }
    } catch {
      setErrors((e) => ({ ...e, [reelId]: "Network error" }));
    } finally {
      setUploading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-ink/50 mt-0.5">Short videos shown on homepage · autoplay, muted</p>
        </div>
        <button
          onClick={addReel}
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
          + Add reel
        </button>
      </div>

      {reels.length === 0 && (
        <div className="mt-10 text-center text-sm text-ink/40 py-16 border border-dashed border-beige rounded-xl">
          No reels yet — click "+ Add reel" to add your first video.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reels.map((reel) => (
          <div key={reel.id} className="rounded-xl border border-beige bg-white overflow-hidden">
            {/* Video preview */}
            <div className="relative bg-black" style={{ aspectRatio: (reel.format ?? "portrait") === "landscape" ? "16/9" : "9/16", maxHeight: 260 }}>
              {(() => {
                const ytId = reel.videoUrl ? getYoutubeId(reel.videoUrl) : null;
                if (ytId) {
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt="YouTube thumbnail"
                      className="h-full w-full object-cover"
                    />
                  );
                }
                if (reel.videoUrl) {
                  return (
                    <video src={reel.videoUrl} className="h-full w-full object-cover" muted loop playsInline controls />
                  );
                }
                return (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-white/40">
                    <span className="text-4xl">🎬</span>
                    <span className="text-xs">No video uploaded</span>
                  </div>
                );
              })()}
              {/* Enabled toggle badge */}
              <button
                onClick={() => toggleReel(reel.id)}
                className={
                  "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium transition-colors " +
                  (reel.enabled ? "bg-green-500 text-white" : "bg-black/40 text-white/60")
                }
              >
                {reel.enabled ? "Live" : "Hidden"}
              </button>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3">
              <input
                value={reel.title}
                onChange={(e) => updateReel(reel.id, { title: e.target.value })}
                placeholder="Reel title (optional)"
                className="w-full rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
              />

              {/* Format toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/50 shrink-0">Format:</span>
                {(["portrait", "landscape"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => updateReel(reel.id, { format: fmt })}
                    className={
                      "rounded-full px-3 py-1 text-xs transition-colors " +
                      ((reel.format ?? "portrait") === fmt
                        ? "bg-brand text-gold-light"
                        : "border border-beige text-ink/50 hover:border-gold")
                    }
                  >
                    {fmt === "portrait" ? "📱 9:16 Portrait" : "🖥️ 16:9 Landscape"}
                  </button>
                ))}
              </div>

              {/* Upload video */}
              <label className={
                "flex items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-2.5 text-sm cursor-pointer transition-colors " +
                (uploading === reel.id ? "border-beige opacity-60 cursor-not-allowed" : "border-beige hover:border-gold text-ink/60 hover:text-brand")
              }>
                {uploading === reel.id ? "Uploading…" : "📤 Upload video (MP4 / WebM · max 100 MB)"}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  disabled={uploading === reel.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadVideo(reel.id, file);
                    e.target.value = "";
                  }}
                />
              </label>

              {errors[reel.id] && (
                <p className="text-xs text-red-500">{errors[reel.id]}</p>
              )}

              {/* Or paste URL / YouTube */}
              <div className="flex gap-2">
                <input
                  value={reel.videoUrl}
                  onChange={(e) => updateReel(reel.id, { videoUrl: e.target.value })}
                  placeholder="Or paste video / YouTube URL"
                  className="flex-1 rounded-lg border border-beige px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  onClick={() => deleteReel(reel.id)}
                  className="px-3 py-2 text-red-400 hover:text-red-600 text-sm border border-beige rounded-lg hover:border-red-300 transition-colors"
                  title="Delete reel"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
