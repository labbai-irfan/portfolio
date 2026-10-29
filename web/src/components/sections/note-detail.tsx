import Link from 'next/link';
import { RichText } from '@/components/portable-text/rich-text';
import { fullDate } from '@/lib/format';
import type { Fetched } from '@/lib/stega';
import type { NOTE_QUERY_RESULT } from '@/sanity/types';
import { DebugSteps } from './debug-steps';

export type NoteDetailData = Fetched<NonNullable<NOTE_QUERY_RESULT>>;

/** A blog post / debugging note: summary strip, optional four-step write-up, then the body. */
export function NoteDetail({ note }: { note: NoteDetailData }) {
  const lines = [
    { label: 'Symptom', value: note.debugSteps?.symptomLine },
    { label: 'Cause', value: note.debugSteps?.causeLine },
    { label: 'Fix', value: note.debugSteps?.fixLine },
  ].filter((line) => line.value);

  return (
    <main id="main">
      <article className="mx-auto flex max-w-225 flex-col gap-10 px-4 pt-6 pb-22 lg:px-10 lg:pt-10">
        <header className="flex flex-col gap-5">
          <nav aria-label="Breadcrumb" className="font-mono text-12 text-muted">
            <Link href="/notes" className="inline-flex min-h-11 items-center">
              ← All notes
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-12 tracking-data text-muted uppercase">
            {note.code && <span>{note.code}</span>}
            <span>{note.category.title}</span>
            <time dateTime={note.date}>{fullDate(note.date)}</time>
          </div>
          <h1 className="m-0 text-44 leading-[1.05] font-semibold tracking-title lg:text-56">
            {note.title}
          </h1>
          <p className="m-0 text-18 leading-[1.55] text-body lg:text-20">{note.summary}</p>
          {note.project && (
            <p className="m-0 font-mono text-12 text-muted">
              From{' '}
              <Link href={`/work/${note.project.slug}`}>
                {note.project.code} {note.project.title}
              </Link>
            </p>
          )}
          {lines.length > 0 && (
            <dl className="m-0 flex flex-col border border-rule-strong bg-surface">
              {lines.map((line) => (
                <div
                  key={line.label}
                  className="flex flex-wrap gap-x-6 gap-y-1 border-rule px-5 py-3.5 not-last:border-b"
                >
                  <dt className="w-20 font-mono text-11 tracking-label text-muted uppercase">
                    {line.label}
                  </dt>
                  <dd className="m-0 min-w-0 flex-[1_1_300px] text-15 leading-[1.55] text-ink">
                    {line.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        <RichText value={note.body} />
        {note.debugSteps && <DebugSteps steps={note.debugSteps} />}

        {note.tags && note.tags.length > 0 && (
          <p className="m-0 border-t border-rule pt-4 font-mono text-12 text-muted">
            {note.tags.join(' · ')}
          </p>
        )}
      </article>
    </main>
  );
}
