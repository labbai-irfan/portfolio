import { promptOf } from '@/components/terminal/commands';
import { Button } from '@/components/ui/button';
import { TerminalWindow } from '@/components/ui/terminal-window';
import { Tile } from '@/components/ui/tile';
import { STATUS_WORDS } from '@/lib/labels';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';
import { statusOf, type ProjectCardData } from '../project-card';

type HomeTerminalProps = {
  settings: Fetched<SETTINGS_QUERY_RESULT>;
  projects: ProjectCardData[];
  className?: string;
};

/** A static taste of the terminal page, written from the same data the real one reads. */
export function HomeTerminal({ settings, projects, className }: HomeTerminalProps) {
  const prompt = promptOf({ name: stegaClean(settings?.name) ?? null });
  const rows = projects.slice(0, 3);
  const statusWidth = Math.max(
    ...rows.map((p) => (STATUS_WORDS[statusOf(p) ?? ''] ?? '').length),
    6,
  );
  return (
    <Tile
      as="section"
      tone="dark"
      labelledBy="home-terminal"
      className={cx('group flex flex-col gap-7 overflow-hidden p-7 md:p-9', className)}
    >
      <div className="flex flex-col gap-3">
        <h2 id="home-terminal" className="m-0 text-28 leading-[1.1] font-semibold tracking-title">
          Prefer a shell?
        </h2>
        <p className="m-0 max-w-110 text-16 leading-[1.6] text-on-bar-body">
          The whole site works from a terminal: projects, skills, the pipeline, contact. Tab
          completes, ↑ recalls.
        </p>
      </div>
      <div aria-hidden="true" className="[perspective:1000px]">
        <TerminalWindow
          title={`${prompt.replace('$', '').replace(':~', ': ~')} — zsh`}
          className="[transform:rotateX(8deg)_rotateY(10deg)] shadow-window transition-transform duration-500 ease-out group-hover:[transform:rotateX(2deg)_rotateY(3deg)]"
        >
          <pre className="m-0 overflow-hidden font-mono text-12 leading-[1.8] whitespace-pre lg:text-13">
            <span className="text-term-prompt">{prompt}</span> projects{'\n'}
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
            <span className="text-term-prompt">{prompt}</span>{' '}
            <span className="inline-block h-4 w-2 bg-term-prompt align-text-bottom motion-safe:animate-[blink_1.1s_steps(1)_infinite]" />
          </pre>
        </TerminalWindow>
      </div>
      <Button href="/terminal" variant="onBar" className="mt-auto self-start rounded-control">
        Open the terminal
      </Button>
    </Tile>
  );
}
