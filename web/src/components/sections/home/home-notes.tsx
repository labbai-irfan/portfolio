import Link from 'next/link';
import { Tile, TILE_LINK } from '@/components/ui/tile';
import { cx } from '@/lib/utils';

type Note = {
  _id: string;
  code: string | null;
  title: string | null;
  slug: string | null;
  project: { code: string | null } | null;
};

// The format every troubleshooting note follows (a real sequence, so numbered).
const STEPS = [
  'Symptom, as logged',
  'What I checked, in order',
  'The real root cause',
  'Fix and prevention',
];

/** The latest note. The whole tile opens it. */
export function HomeNotes({ note, className }: { note: Note | null; className?: string }) {
  if (!note?.slug) return null;
  const meta = [note.code, note.project?.code && `from ${note.project.code}`].filter(Boolean);
  return (
    <Tile
      as="section"
      interactive
      labelledBy="home-notes"
      className={cx('flex flex-col gap-5 p-7 md:p-9', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span id="home-notes" className="text-14 font-medium text-muted">
          How I debug{meta.length > 0 && ` · ${meta.join(' · ')}`}
        </span>
      </div>
      <h2 className="m-0 text-24 leading-[1.18] font-semibold tracking-lead lg:text-28">
        <Link href={`/notes/${note.slug}`} className={cx('text-ink no-underline', TILE_LINK)}>
          {note.title}
        </Link>
      </h2>
      <ol className="m-0 flex list-none flex-col gap-2 p-0 text-15 text-body">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-chip bg-progress-bg font-mono text-12 font-semibold text-progress"
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <span aria-hidden="true" className="mt-auto pt-2 text-15 font-medium text-signal">
        Read the note
      </span>
    </Tile>
  );
}
