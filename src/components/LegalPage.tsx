export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="font-heading italic text-3xl text-brand mb-6">{title}</h1>
      <div className="prose prose-sm max-w-none text-ink/80 space-y-4 [&_h2]:text-brand [&_h2]:font-heading [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
