import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { PageHero } from '@/components/ui/page-hero';
import { fullDate } from '@/lib/format';
import { getSiteUrl } from '@/lib/site-url';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { NOTES_QUERY, PAGE_COPY_QUERY } from '@/sanity/queries';

// The four-step format every troubleshooting note follows — describes the format, not a note.
const FORMAT_STEPS = [
  { title: 'Symptom', text: 'The exact error, as logged — not a paraphrase.' },
  { title: 'Checked', text: 'What I ruled out, in order, with the commands.' },
  { title: 'Root cause', text: 'What was actually wrong, and why it looked otherwise.' },
  { title: 'Fix & prevention', text: "The change, and how I'd catch it sooner next time." },
];

export const generateMetadata = () => pageMetadata('notes', '/notes');

export default async function NotesPage() {
  const dynamic = await getDynamicFetchOptions();
  return <NotesContent {...dynamic} />;
}

async function NotesContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: copy }, { data: notes }] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: NOTES_QUERY, perspective, stega }),
  ]);

  return (
    <main id="main">
      <div className="border-b border-rule-strong bg-surface">
        {copy?.notes?.heading && (
          <PageHero
            kicker="How I debug"
            heading={copy.notes.heading}
            intro={copy.notes.intro}
            className="pb-14"
          />
        )}
      </div>

      <section aria-labelledby="fmt-h" className="border-b border-rule-strong">
        <div className="mx-auto flex max-w-page flex-col gap-5 px-4 py-12 lg:px-10">
          <h2 id="fmt-h" className="m-0 font-mono text-12 tracking-label text-muted uppercase">
            Troubleshooting notes follow four steps
          </h2>
          <ol className="m-0 flex list-none flex-wrap border border-rule-strong bg-surface p-0">
            {FORMAT_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex min-w-0 flex-[1_1_220px] flex-col gap-2 border-rule p-6 not-last:border-r"
              >
                <span className="font-mono text-28 font-medium text-signal">{index + 1}</span>
                <span className="text-17 font-semibold">{step.title}</span>
                <span className="text-14 leading-[1.55] text-body">{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="list-h">
        <div className="mx-auto flex max-w-page flex-col gap-6 px-4 pt-14 pb-24 lg:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="list-h" className="m-0 text-32 font-semibold tracking-lead">
              Notes
            </h2>
            <span className="flex flex-wrap items-center gap-x-5 font-mono text-12 text-muted">
              {notes.length > 0 && (
                <span>
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'} · newest first
                </span>
              )}
              {/* The feed needs the site's domain; without one it would be a dead link. */}
              {getSiteUrl() && (
                <a href="/feed.xml" className="inline-flex min-h-11 items-center">
                  RSS feed
                </a>
              )}
            </span>
          </div>

          {notes.map((note) => (
            <article key={note._id} className="flex flex-wrap border border-rule-strong bg-surface">
              <div className="flex flex-[0_0_200px] flex-col gap-2.5 border-r border-rule p-8">
                {note.code && (
                  <span className="font-mono text-12 tracking-data text-muted">{note.code}</span>
                )}
                {note.date && <span className="font-mono text-13">{fullDate(note.date)}</span>}
                {note.category?.title && (
                  <span className="self-start border border-rule-dashed px-2 py-1 font-mono text-11 font-semibold tracking-chip text-body uppercase">
                    {note.category.title}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 p-6 lg:flex-[1_1_520px] lg:p-8">
                <h3 className="m-0 text-26 leading-[1.15] font-semibold tracking-lead lg:text-32">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="text-ink no-underline hover:text-ink"
                  >
                    {note.title}
                  </Link>
                </h3>
                <p className="m-0 max-w-170 text-16 leading-[1.6] text-body">{note.summary}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {note.tags?.map((tag) => (
                    <span key={tag} className="border border-rule px-2.5 py-1.25 font-mono text-12">
                      {tag}
                    </span>
                  ))}
                  {note.project?.code && (
                    <span className="ml-2 font-mono text-12 text-muted">
                      from {note.project.code}
                    </span>
                  )}
                </div>
                <Link
                  href={`/notes/${note.slug}`}
                  className="flex min-h-11 items-center self-start text-15 font-medium no-underline"
                >
                  Read the note →
                </Link>
              </div>
            </article>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 border border-dashed border-rule-dashed p-8">
            <p className="m-0 max-w-160 text-16 leading-[1.6] text-body">
              The next note publishes when something real breaks. This list never gets padded with
              filler.
            </p>
            <Link
              href="/work"
              className="flex min-h-11 items-center text-15 font-medium no-underline"
            >
              Meanwhile, see the work →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
