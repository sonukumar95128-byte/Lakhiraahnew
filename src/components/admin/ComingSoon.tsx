export function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-heading italic text-3xl text-brand mb-3">{title}</h1>
      <div className="rounded-xl border border-dashed border-beige bg-white p-10 text-center text-sm text-ink/50">
        This section isn&apos;t built yet — let me know when you&apos;d like it next.
      </div>
    </div>
  );
}
