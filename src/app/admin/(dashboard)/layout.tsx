import Image from "next/image";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-ivory">
      <aside className="w-56 shrink-0 sticky top-0 h-screen border-r border-beige bg-brand flex flex-col">
        <div className="px-5 py-5 border-b border-gold-light/15 shrink-0">
          <Image
            src="/brand/lakshiraah-logo.png"
            alt="Lakshiraah"
            width={180}
            height={50}
            className="h-10 w-auto object-contain"
            priority
          />
          <p className="mt-1 text-xs text-gold-light/50">Admin panel</p>
        </div>
        <AdminNav />
        <form action="/api/admin/logout" method="POST" className="px-3 py-4 border-t border-gold-light/15 shrink-0">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-sm text-gold-light/80 bg-brand-secondary/40 hover:bg-brand-secondary hover:text-gold-light transition-colors text-left"
          >
            Log out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-6 sm:p-8 min-w-0">{children}</main>
    </div>
  );
}
