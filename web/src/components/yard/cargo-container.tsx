import { TechMarkIcon } from '@/components/yard/tech-mark-icon';
import { SKILL_TIERS } from '@/lib/labels';
import { type Fetched, stegaClean } from '@/lib/stega';
import { marksFor } from '@/lib/tech-marks';
import { cx } from '@/lib/utils';
import type { SKILLS_QUERY_RESULT } from '@/sanity/types';

type Skill = Fetched<SKILLS_QUERY_RESULT[number]>;

// Each tier borrows its status-chip colour pair, which the contrast check already covers.
const TIER_COLOURS: Record<string, string> = {
  work: '[--cargo-bg:var(--color-live-bg)] [--cargo-ink:var(--color-live)]',
  projects: '[--cargo-bg:var(--color-progress-bg)] [--cargo-ink:var(--color-progress)]',
  learning: '[--cargo-bg:var(--color-lab-bg)] [--cargo-ink:var(--color-lab)]',
};

/** One skill as a shipping container. Opens the skill's manifest. */
export function CargoContainer({ skill, onOpen }: { skill: Skill; onOpen: () => void }) {
  const tier = stegaClean(skill.tier);
  const marks = marksFor(stegaClean(skill.name));
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onOpen}
      className={cx('cargo min-h-11', TIER_COLOURS[tier])}
    >
      <span data-cargo="cable" aria-hidden="true" />
      <span data-cargo="box" className="items-center gap-2.5 px-3 py-2.5">
        <span data-cargo="top" aria-hidden="true" />
        <span data-cargo="side" aria-hidden="true" />
        {marks.length > 0 && (
          <span className="flex shrink-0 gap-1.5">
            {marks.map((mark) => (
              <TechMarkIcon key={mark.title} mark={mark} className="size-4.5" />
            ))}
          </span>
        )}
        <span className="min-w-0 text-13 leading-tight font-semibold text-balance">
          {skill.name}
          <span className="sr-only">, {SKILL_TIERS[tier] ?? tier}</span>
        </span>
      </span>
      <span data-cargo="shadow" aria-hidden="true" />
    </button>
  );
}
