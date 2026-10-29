import { promptOf } from '@/components/terminal/commands';
import { Button } from '@/components/ui/button';
import { sectionNumber } from '@/lib/format';
import { STATUS_WORDS } from '@/lib/labels';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';
import { type Fetched, stegaClean } from '@/lib/stega';
import { statusOf, type ProjectCardData } from '../project-card';

type HomeTerminalProps = {
  index: number;
  settings: Fetched<SETTINGS_QUERY_RESULT>;
  projects: ProjectCardData[];
};

/** A static taste of the terminal page, written from the same data the real one reads. */
export function HomeTerminal({ index, settings, projects }: HomeTerminalProps) {
  const PROMPT = promptOf({ name: stegaClean(settings?.name) ?? null });
  const rows = projects.slice(0, 3);
  const statusWidth = Math.max(
    ...rows.map((p) => (STATUS_WORDS[statusOf(p) ?? ''] ?? '').length),
    6,
  );
  return (
    <section
      aria-labelledby="home-terminal"
      className="border-t border-rule-strong bg-bar text-on-bar"
    >
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-14 px-4 py-16 lg:px-10 lg:py-22">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5 lg:flex-[1_1_380px]">
          <span className="font-mono text-12 tracking-label text-on-bar-meta uppercase">
            {sectionNumber(index)} — Terminal
          </span>
          <h2
            id="home-terminal"
            className="m-0 text-32 leading-none font-semibold tracking-title lg:text-52"
          >
            Prefer a shell?
          </h2>
          <p className="m-0 text-17 leading-[1.6] text-on-bar-body">
            The whole site works from a terminal — projects, skills, the pipeline, contact. Tab
            completes, ↑ recalls.
          </p>
          <Button href="/terminal" variant="onBar" className="self-start">
            Open the terminal →
          </Button>
        </div>
        <div
          aria-hidden="true"
          className="min-w-0 flex-[1.3_1_320px] border border-term-border bg-term-deep lg:flex-[1.3_1_520px]"
        >
          <div className="flex gap-1.5 border-b border-term-rule px-4 py-3">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2.5 rounded-full bg-term-control" />
            ))}
          </div>
          <pre className="m-0 px-5.5 py-6 font-mono text-12 leading-[1.75] whitespace-pre-wrap text-term-out lg:text-14">
            <span className="text-term-prompt">{PROMPT}</span> whoami{'\n'}
            {settings?.name} — {settings?.headlineLabel}
            {'\n'}
            <span className="text-term-hint">
              {[settings?.location, settings?.openToRoles && 'open to roles']
                .filter(Boolean)
                .join(' · ')}
            </span>
            {'\n'}
            <span className="text-term-prompt">{PROMPT}</span> projects{'\n'}
            <span className="font-semibold text-term-head">
              {'ID'.padEnd(7)}
              {'STATUS'.padEnd(statusWidth + 2)}PROJECT
            </span>
            {'\n'}
            {rows.map((p) => (
              <span key={p._id}>
                {(p.code ?? '').toLowerCase().padEnd(7)}
                {(STATUS_WORDS[statusOf(p) ?? ''] ?? '').padEnd(statusWidth + 2)}
                {p.title}
                {'\n'}
              </span>
            ))}
            <span className="text-term-prompt">{PROMPT}</span>{' '}
            <span className="inline-block h-4.25 w-2.25 bg-term-prompt align-text-bottom" />
          </pre>
        </div>
      </div>
    </section>
  );
}
