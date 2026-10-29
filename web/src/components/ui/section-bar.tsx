import Link from 'next/link';

type SectionBarProps = {
  /** Full heading, e.g. "01 — Work". Rendered uppercase. */
  title: string;
  headingId?: string;
  meta?: { label: string; href: string };
};

export function SectionBar({ title, headingId, meta }: SectionBarProps) {
  return (
    <div className="bg-bar text-on-bar">
      <div className="mx-auto flex max-w-page flex-wrap items-baseline justify-between gap-2 px-4 py-3.5 md:px-10 md:py-4.5">
        <h2
          id={headingId}
          className="m-0 font-mono text-12 font-medium tracking-label uppercase md:text-13"
        >
          {title}
        </h2>
        {meta && (
          <Link
            href={meta.href}
            className="font-mono text-11 tracking-chip text-on-bar-meta uppercase no-underline hover:text-on-bar md:text-12"
          >
            {meta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
