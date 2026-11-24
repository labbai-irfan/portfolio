'use client';

import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { DEPLOY_TARGET } from '@/components/terminal/commands';
import { CargoContainer } from '@/components/yard/cargo-container';
import { ExploringDock } from '@/components/yard/exploring-dock';
import { ManifestDrawer } from '@/components/yard/manifest-drawer';
import { SKILL_TIERS } from '@/lib/labels';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import { planYard } from '@/lib/yard';
import type { SKILLS_QUERY_RESULT } from '@/sanity/types';

type Skill = Fetched<SKILLS_QUERY_RESULT[number]>;

/**
 * The stack as a container yard: every skill with evidence behind it is a container, stacked by
 * tier with "At work" as the ground row. Learning skills with nothing to show are listed as text,
 * and roadmap skills sit apart in the Exploring dock. Hidden when there is nothing to draw.
 */
export function ContainerYard({ skills, className }: { skills: Skill[]; className?: string }) {
  const baseId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Skill | null>(null);

  const plan = planYard(
    skills.map((skill) => ({
      item: skill,
      tier: stegaClean(skill.tier),
      hasUsage: Boolean(skill.usageNote) || (skill.usedIn?.length ?? 0) > 0,
    })),
  );
  if (plan.rows.length === 0 && plan.exploring.length === 0) return null;

  // Render the manifest before showModal(), so the browser can move focus into it.
  const open = (skill: Skill) => {
    flushSync(() => setSelected(skill));
    dialogRef.current?.showModal();
  };

  return (
    <section
      id={DEPLOY_TARGET}
      aria-labelledby={`${baseId}-heading`}
      className={cx('seam scroll-mt-17', className)}
    >
      <div className="mx-auto max-w-page px-4 py-12 reveal lg:px-10 lg:py-16">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2
            id={`${baseId}-heading`}
            className="m-0 text-28 leading-[1.1] font-semibold tracking-heading"
          >
            Container yard
          </h2>
          <p className="m-0 text-14 text-muted">
            Stacked by how each was used. Open a container for its manifest.
          </p>
        </div>

        <div
          className={cx(
            'grid gap-10',
            plan.exploring.length > 0 && 'lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end',
          )}
        >
          <div className="flex flex-col gap-6 md:gap-9">
            {plan.rows.map((row) => (
              <div
                key={row.tier}
                className="grid gap-3 md:grid-cols-[7rem_minmax(0,1fr)] md:items-center"
              >
                <h3 className="m-0 font-mono text-12 font-medium text-muted">
                  {SKILL_TIERS[row.tier] ?? row.tier}
                </h3>
                <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:gap-x-7 lg:grid-cols-4">
                  {row.items.map((skill) => (
                    <li key={skill._id}>
                      <CargoContainer skill={skill} onOpen={() => open(skill)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {plan.rows.length > 0 && (
              <span aria-hidden="true" className="-mt-2 h-1 bg-rule-strong md:ml-31" />
            )}
            {plan.alsoLearning.length > 0 && (
              <p className="m-0 text-13 text-muted md:ml-31">
                <span className="font-semibold text-body">Also learning: </span>
                {plan.alsoLearning.map((skill) => skill.name).join(', ')}
              </p>
            )}
          </div>
          {plan.exploring.length > 0 && (
            <ExploringDock skills={plan.exploring} headingId={`${baseId}-exploring`} />
          )}
        </div>
      </div>
      <ManifestDrawer skill={selected} dialogRef={dialogRef} />
    </section>
  );
}
