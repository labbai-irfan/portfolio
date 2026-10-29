import { pageMetadata } from '@/lib/metadata';
import { RoleArticle } from '@/components/sections/role-article';
import { CalloutBanner } from '@/components/ui/callout-banner';
import { PageHero } from '@/components/ui/page-hero';
import { dateRange, monthsBetween } from '@/lib/format';
import { stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { PAGE_COPY_QUERY, ROLES_QUERY } from '@/sanity/queries';

export const generateMetadata = () => pageMetadata('experience', '/experience');

export default async function ExperiencePage() {
  const dynamic = await getDynamicFetchOptions();
  return <ExperienceContent {...dynamic} />;
}

async function ExperienceContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: copy }, { data: roles }] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: ROLES_QUERY, perspective, stega }),
  ]);

  const work = roles.filter((role) => stegaClean(role.kind) !== 'education');
  const education = roles.filter((role) => stegaClean(role.kind) === 'education');
  // The ruler reads oldest → newest, each cell as wide as the time it covers.
  const ruler = [...roles]
    .filter((role): role is typeof role & { startDate: string } => Boolean(role.startDate))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <main id="main">
      <div className="border-b border-rule-strong bg-surface">
        {copy?.experience?.heading && (
          <PageHero
            kicker="Experience"
            heading={copy.experience.heading}
            intro={copy.experience.intro}
            className="pb-9"
          />
        )}
        {ruler.length > 0 && (
          <div className="mx-auto max-w-page px-4 pb-10 lg:px-10">
            <ol
              aria-label="Career timeline"
              className="m-0 flex list-none flex-wrap border border-rule-strong p-0 font-mono text-12"
            >
              {ruler.map((role) => {
                const current = !role.endDate && stegaClean(role.kind) === 'employment';
                return (
                  <li
                    key={role._id}
                    style={{ flexGrow: Math.min(monthsBetween(role.startDate, role.endDate), 36) }}
                    className={cx(
                      'flex min-w-45 flex-[1_1_200px] flex-col gap-1 border-rule px-4.5 py-3.5 not-last:border-r',
                      current && 'bg-signal text-on-signal',
                    )}
                  >
                    <span className={current ? 'text-on-signal-muted' : 'text-muted'}>
                      {dateRange(role.startDate, role.endDate, {
                        yearsOnly: role.yearsOnly,
                        ongoing: 'Now',
                      })}
                    </span>
                    <span>{role.title}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-page flex-col gap-12 px-4 pt-16 pb-24 lg:px-10">
        {work.map((role) => (
          <RoleArticle key={role._id} role={role} />
        ))}

        {education.length > 0 && (
          <section aria-labelledby="edu-h" className="flex flex-col gap-5">
            <h2 id="edu-h" className="m-0 font-mono text-12 tracking-label text-muted uppercase">
              Education
            </h2>
            <div className="flex flex-wrap gap-6">
              {education.map((role) => (
                <article
                  key={role._id}
                  className="flex min-w-0 flex-[1_1_320px] flex-col gap-2 border border-rule-strong bg-surface px-8 py-7"
                >
                  <span
                    className={cx(
                      'font-mono text-12 uppercase',
                      role.endDate ? 'text-muted' : 'text-signal',
                    )}
                  >
                    {dateRange(role.startDate ?? '', role.endDate, {
                      yearsOnly: role.yearsOnly,
                      ongoing: 'In progress',
                    })}
                  </span>
                  <h3 className="m-0 text-22 font-semibold">{role.title}</h3>
                  <p className="m-0 text-15 leading-[1.55] text-body">
                    {[role.organisation, role.location].filter(Boolean).join(', ')}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <CalloutBanner
          text="The one-page version, for your ATS."
          action={{ label: 'View résumé →', href: '/resume' }}
        />
      </div>
    </main>
  );
}
