export const metadata = { title: "Store Locator — Lakshiraah" };

export default function StoreLocatorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="font-heading italic text-3xl text-brand mb-6">Store Locator</h1>

      <div className="rounded-xl border border-beige bg-white p-6">
        <p className="text-sm font-medium text-brand mb-1">Lakshiraah — Flagship Store</p>
        <p className="text-sm text-ink/70 mb-3">
          [Store address] · [City, State, Pincode]
        </p>
        <p className="text-sm text-ink/60">Open Mon-Sat, 10am-7pm IST</p>
        <p className="text-sm text-ink/60">+91 12345 67890</p>
      </div>

      <p className="mt-6 text-sm text-ink/50">
        Currently shipping online, pan-India. Visit our <a href="/help/contact" className="text-gold underline hover:text-brand">Contact page</a> to ask about in-person appointments.
      </p>
    </div>
  );
}
