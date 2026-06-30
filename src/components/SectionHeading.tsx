import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function SectionHeading({ title, subtitle, viewAllHref, viewAllLabel = "View all" }: SectionHeadingProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="font-heading italic text-3xl text-brand">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
      {viewAllHref && (
        <Link href={viewAllHref} className="mt-2 inline-block text-sm text-gold hover:text-brand">
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
