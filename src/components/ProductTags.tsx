export function ProductTags({ categoryTags, tags }: { categoryTags: string[]; tags: string[] }) {
  return (
    <div className="mt-10 space-y-5">
      <div>
        <h3 className="text-sm font-medium text-brand mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categoryTags.map((t) => (
            <span key={t} className="rounded-full bg-beige px-3 py-1 text-xs text-ink/70">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-brand mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-beige px-3 py-1 text-xs text-ink/70">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
