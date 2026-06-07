import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeader({
  title,
  href,
  linkLabel = "See all",
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
