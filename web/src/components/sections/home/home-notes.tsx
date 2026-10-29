import Link from 'next/link';
import { SectionBar } from '@/components/ui/section-bar';
import { sectionNumber } from '@/lib/format';

type Note = {
  _id: string;
  code: string | null;
  title: string | null;
  slug: string | null;
  project: { code: string | null } | null;
};

// The format every troubleshooting note follows; the right-hand list describes it.
const STEPS = [
  ['1 · Symptom', 'as logged'],
  ['2 · Checked', 'in order'],
  ['3 · Root cause', 'the real one'],
  ['4 · Fix & prevention', 'next time'],
];

export function HomeNotes({ index, note }: { index: number; note: Note | null }) {
  if (!note?.slug) return null;
  return (
    <section aria-labelledby="home-notes" className="border-t border-rule-strong">
      <SectionBar
        headingId="home-notes"
        title={`${sectionNumber(index)} — How I debug`}
        meta={{ label: 'All notes →', href: '/notes' }}
      />
      <div className="mx-auto max-w-page px-4 pt-14 pb-22 lg:px-10">
        <Link
          href={`/notes/${note.slug}`}
          className="flex flex-wrap border border-rule-strong bg-surface text-ink no-underline hover:text-ink"
        >
          <div className="flex min-w-0 flex-[1.3_1_320px] flex-col gap-3 border-rule p-7 lg:flex-[1.3_1_440px] lg:border-r lg:p-9">
            <span className="font-mono text-12 tracking-data text-muted uppercase">
              {[note.code, note.project?.code && `from ${note.project.code}`]
                .filter(Boolean)
                .join(' · ')}
            </span>
            <span className="text-26 leading-[1.15] font-semibold tracking-lead lg:text-32">
              {note.title}
            </span>
            <span className="text-15 font-medium text-signal">Read the note →</span>
          </div>
          <ol className="m-0 min-w-0 flex-[1_1_340px] list-none p-0 font-mono text-13">
            {STEPS.map(([label, hint], i) => (
              <li
                key={label}
                className={`flex justify-between px-6 py-4 ${i === STEPS.length - 1 ? 'bg-progress-bg text-progress' : 'border-b border-rule'}`}
              >
                <span>{label}</span>
                <span className={i === STEPS.length - 1 ? '' : 'text-muted'}>{hint}</span>
              </li>
            ))}
          </ol>
        </Link>
      </div>
    </section>
  );
}
