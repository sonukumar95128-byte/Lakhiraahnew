export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/admin", error } = await searchParams;

  return (
    <div className="min-h-screen grid place-items-center bg-ivory px-4">
      <div className="w-full max-w-sm rounded-xl border border-beige bg-white p-6">
        <h1 className="font-heading italic text-2xl text-brand mb-1">Admin access</h1>
        <p className="text-sm text-ink/50 mb-5">Enter the admin password to continue.</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Incorrect password.</p>
        )}

        <form action="/api/admin/login" method="POST" className="space-y-3">
          <input type="hidden" name="next" value={next} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
