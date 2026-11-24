import { TechMarkIcon } from '@/components/yard/tech-mark-icon';
import type { Fetched } from '@/lib/stega';
import { TECH_MARKS } from '@/lib/tech-marks';
import type { SKILLS_QUERY_RESULT } from '@/sanity/types';

type Skill = Fetched<SKILLS_QUERY_RESULT[number]>;

/**
 * Roadmap skills, kept apart from the yard: nothing here has been used yet. The helm wheel turns
 * slowly to say "not docked yet"; it is decoration, and still under reduced motion.
 */
export function ExploringDock({ skills, headingId }: { skills: Skill[]; headingId: string }) {
  return (
    <aside
      aria-labelledby={headingId}
      className="flex items-start gap-4 border border-dashed border-rule-dashed px-5 py-4"
    >
      <TechMarkIcon mark={TECH_MARKS.kubernetes} className="size-9 shrink-0 helm-turn text-muted" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3
          id={headingId}
          className="m-0 font-mono text-11 font-semibold tracking-label text-muted"
        >
          EXPLORING / ROADMAP
        </h3>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {skills.map((skill) => (
            <li key={skill._id} className="text-14 text-body">
              <span className="font-semibold text-ink">{skill.name}</span>
              {skill.usageNote && <span className="text-muted"> · {skill.usageNote}</span>}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
