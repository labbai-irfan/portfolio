import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { Fragment } from 'react';
import { PageHero } from '@/components/ui/page-hero';
import { SKILL_GROUP_ORDER, SKILL_GROUPS, SKILL_TIERS } from '@/lib/labels';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { MILESTONES_QUERY, PAGE_COPY_QUERY, SKILLS_QUERY } from '@/sanity/queries';
import type { SKILLS_QUERY_RESULT } from '@/sanity/types';

type Skill = Fetched<SKILLS_QUERY_RESULT[number]>;
type UsedIn = NonNullable<Skill['usedIn']>[number];

const TIER_CHIP: Record<string, string> = {
  work: 'bg-contrast text-on-contrast',
  projects: 'border border-signal text-progress',
  learning: 'border border-dashed border-rule-dashed text-planned',
};

// What each tier means, for the legend beside the heading.
const TIER_MEANING: Record<string, string> = {
  work: 'Used in production at my job',
  projects: 'Built something real with it',
  learning: 'Actively studying, lab-level',
};

/** Where a skill is used: a link to the project, note or experience it comes from. */
function usedInLink(item: UsedIn | null) {
  if (!item) return null;
  const type = stegaClean(item._type);
  if (type === 'role') return { href: '/experience', label: 'Experience' };
  if (type === 'project' && item.slug)
    return { href: `/work/${item.slug}`, label: item.title ?? item.code ?? 'Project' };
  if (type === 'note' && item.slug)
    return { href: `/notes/${item.slug}`, label: item.title ?? 'Note' };
  return null;
}

export const generateMetadata = () => pageMetadata('skills', '/skills');

export default async function SkillsPage() {
  const dynamic = await getDynamicFetchOptions();
  return <SkillsContent {...dynamic} />;
}

async function SkillsContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: copy }, { data: skills }, { data: milestones }] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: SKILLS_QUERY, perspective, stega }),
    cachedSanity({ query: MILESTONES_QUERY, perspective, stega }),
  ]);

  const groups = SKILL_GROUP_ORDER.map((key) => ({
    key,
    skills: skills.filter((skill) => stegaClean(skill.group) === key),
  })).filter((group) => group.skills.length > 0);
  const tiersInUse = Object.keys(SKILL_TIERS).filter((tier) =>
    skills.some((s) => stegaClean(s.tier) === tier),
  );

  // What is planned next, in the order the Journey lists it.
  const next = milestones.filter(
    (m) =>
      m.planned && (stegaClean(m.category) === 'project' || stegaClean(m.category) === 'learning'),
  );

  return (
    <main id="main">
      <div className="border-b border-rule-strong bg-surface">
        {copy?.skills?.heading && (
          <PageHero
            kicker="Skills"
            heading={copy.skills.heading}
            intro={copy.skills.intro}
            className="pb-12"
            aside={
              tiersInUse.length > 0 && (
                <dl className="m-0 flex min-w-0 flex-[0_1_340px] flex-col border border-rule-strong">
                  {tiersInUse.map((tier) => (
                    <div
                      key={tier}
                      className="flex items-center gap-3.5 border-rule px-4.5 py-3.5 not-last:border-b"
                    >
                      <dt>
                        <span
                          className={cx(
                            'px-2 py-1 font-mono text-11 font-semibold tracking-chip uppercase',
                            TIER_CHIP[tier],
                          )}
                        >
                          {SKILL_TIERS[tier]}
                        </span>
                      </dt>
                      <dd className="m-0 text-14 text-body">{TIER_MEANING[tier]}</dd>
                    </div>
                  ))}
                </dl>
              )
            }
          />
        )}
      </div>

      <section aria-label="Skills table" className="mx-auto max-w-page px-4 pt-14 pb-8 lg:px-10">
        <div className="overflow-x-auto border border-rule-strong bg-surface">
          <table className="w-full min-w-190 border-collapse text-15">
            <thead>
              <tr className="bg-bar text-on-bar">
                {['Skill', 'Tier', "Where it's used"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="border-0 px-5.5 py-3.5 text-left font-mono text-11 font-medium tracking-label uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <Fragment key={group.key}>
                  <tr>
                    <th
                      colSpan={3}
                      scope="colgroup"
                      className="bg-ground px-5.5 pt-4.5 pb-2.5 text-left font-mono text-11 font-medium tracking-label text-signal uppercase"
                    >
                      {SKILL_GROUPS[group.key]}
                    </th>
                  </tr>
                  {group.skills.map((skill) => {
                    const links = (skill.usedIn ?? [])
                      .map(usedInLink)
                      .filter((link): link is NonNullable<typeof link> => link !== null);
                    return (
                      <tr key={skill._id} className="border-b border-rule">
                        <th scope="row" className="px-5.5 py-3.5 text-left font-semibold">
                          {skill.name}
                        </th>
                        <td className="px-5.5 py-3.5">
                          {skill.tier && (
                            <span
                              className={cx(
                                'px-2 py-1 font-mono text-11 font-semibold tracking-chip uppercase',
                                TIER_CHIP[stegaClean(skill.tier) ?? ''],
                              )}
                            >
                              {SKILL_TIERS[stegaClean(skill.tier) ?? ''] ?? skill.tier}
                            </span>
                          )}
                        </td>
                        <td className="px-5.5 py-3.5">
                          {skill.usageNote && <div>{skill.usageNote}</div>}
                          {links.length > 0 && (
                            <div className={cx(skill.usageNote && 'mt-0.5 text-13')}>
                              {links.map((link, index) => (
                                <Fragment key={link.href}>
                                  {index > 0 && ' · '}
                                  <Link href={link.href} className="no-underline">
                                    {link.label}
                                  </Link>
                                </Fragment>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {next.length > 0 && (
        <section
          aria-labelledby="next-h"
          className="mx-auto flex max-w-page flex-col gap-5 px-4 pt-10 pb-24 lg:px-10"
        >
          <h2 id="next-h" className="m-0 text-32 font-semibold tracking-lead">
            What I&apos;m learning next, in order
          </h2>
          <ol className="m-0 flex list-none flex-wrap border border-rule-strong bg-surface p-0">
            {next.map((item, index) => (
              <li
                key={item._id}
                className="flex min-w-0 flex-[1_1_260px] flex-col gap-2 border-rule p-6 not-last:border-r"
              >
                <span
                  className={cx(
                    'font-mono text-12 uppercase',
                    index === 0 ? 'text-signal' : 'text-muted',
                  )}
                >
                  {item.dateLabel}
                </span>
                <span className="text-17 font-semibold">{item.title}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
