"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-store";

export default function RegisterPage() {
  const { register } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    setLoading(true);
    const result = await register(form.name, form.email, form.phone, form.password);
    setLoading(false);
    if (result.ok) {
      router.push("/account");
    } else {
      setError(result.error ?? "Registration failed.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="font-heading italic text-3xl text-brand">Lakshiraah</p>
            <p className="text-xs text-ink/40 tracking-widest uppercase mt-0.5">Luxurious Concepts</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-beige p-8">
          <h1 className="font-heading italic text-2xl text-brand mb-1">Create account</h1>
          <p className="text-sm text-ink/50 mb-6">Join Lakshiraah for exclusive offers &amp; order tracking</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Priya Sharma"
                autoComplete="name"
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Mobile number</label>
              <div className="flex gap-2">
                <span className="flex items-center rounded-lg border border-beige px-3 text-sm text-ink/60 bg-beige/30">+91</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="9876543210"
                  autoComplete="tel"
                  maxLength={10}
                  className="flex-1 rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-beige px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 text-xs"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Confirm password</label>
              <input
                type={showPw ? "text" : "password"}
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
            </div>

            <p className="text-xs text-ink/40">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-gold hover:text-brand">Terms</Link> and{" "}
              <Link href="/privacy" className="text-gold hover:text-brand">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-60 transition-colors"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/50 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand font-medium hover:text-gold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
