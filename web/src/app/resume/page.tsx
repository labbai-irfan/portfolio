import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { dateRange } from '@/lib/format';
import { SKILL_TIER_ORDER, SKILL_TIERS } from '@/lib/labels';
import { stegaClean } from '@/lib/stega';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { PROJECTS_QUERY, ROLES_QUERY, SETTINGS_QUERY, SKILLS_QUERY } from '@/sanity/queries';

// Status wording on the one-page résumé: plain lower-case words, no chips.
const STATUS_WORDS: Record<string, string> = {
  live: 'live',
  inDevelopment: 'in development',
  shipsWithSite: 'ships with site',
  learningLab: 'learning lab',
  planned: 'planned',
};

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="m-0 mb-3 border-b border-ink pb-2 font-mono text-11 font-medium tracking-[0.12em] text-signal uppercase">
      {children}
    </h2>
  );
}

export const generateMetadata = () => pageMetadata('resume', '/resume');

export default async function ResumePage() {
  const dynamic = await getDynamicFetchOptions();
  return <ResumeContent {...dynamic} />;
}

async function ResumeContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: settings }, { data: roles }, { data: projects }, { data: skills }] =
    await Promise.all([
      cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
      cachedSanity({ query: ROLES_QUERY, perspective, stega }),
      cachedSanity({ query: PROJECTS_QUERY, perspective, stega }),
      cachedSanity({ query: SKILLS_QUERY, perspective, stega }),
    ]);

  const work = roles.filter((role) => stegaClean(role.kind) !== 'education');
  const education = roles.filter((role) => stegaClean(role.kind) === 'education');
  // The same flag that puts a project on Home decides what fits on one page here.
  const featured = projects.filter(
    (project) => project.featured && stegaClean(project.status) !== 'planned',
  );
  const skillRows = SKILL_TIER_ORDER.map((tier) => ({
    tier,
    names: skills.filter((skill) => stegaClean(skill.tier) === tier).map((skill) => skill.name),
  })).filter((row) => row.names.length > 0);
  const contact = [
    settings?.location,
    settings?.email,
    [settings?.linkedinUrl, settings?.githubUrl].filter(Boolean).join(' · '),
  ].filter(Boolean);

  return (
    <main id="main" className="print:bg-white bg-ground">
      <div className="mx-auto flex max-w-220 flex-wrap items-center justify-between gap-4 px-6 pt-10 pb-5 print:hidden">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-12 tracking-label text-muted uppercase">
            Résumé · one page
          </span>
          <span className="text-14 text-body">Plain text, ATS-friendly.</span>
        </div>
        <div className="flex gap-2.5">
          {settings?.resumeUrl && (
            <a
              href={settings.resumeUrl}
              download
              className="flex min-h-12 items-center gap-2.5 bg-signal px-5 text-15 font-medium text-on-signal no-underline hover:text-on-signal"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 2v7M4 6.5 7 9.5l3-3M2.5 12h9" />
              </svg>
              Download PDF
            </a>
          )}
          <Link
            href="/contact"
            className="flex min-h-12 items-center border border-ink bg-surface px-5 text-15 font-medium text-ink no-underline hover:text-ink"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* The sheet is paper: always the light palette, whatever the site theme (and in print). */}
      <article
        aria-label="Résumé"
        data-theme="light"
        className="mx-auto mb-24 flex max-w-208 flex-col gap-8 border border-ink bg-surface px-6 py-10 text-ink lg:px-16 lg:py-14 print:mb-0 print:max-w-none print:border-0 print:p-0"
      >
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="m-0 text-34 leading-none font-semibold tracking-title lg:text-40">
              {settings?.resumeName ?? settings?.name}
            </h1>
            {settings?.resumeHeadline && (
              <p className="m-0 text-16 text-body">{settings.resumeHeadline}</p>
            )}
          </div>
          {contact.length > 0 && (
            <ul className="m-0 flex list-none flex-col gap-0.75 p-0 font-mono text-12 text-body lg:text-right">
              {contact.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </header>

        {settings?.resumeSummary && (
          <section>
            <Heading>Summary</Heading>
            <p className="m-0 text-14 leading-[1.65] text-body">{settings.resumeSummary}</p>
          </section>
        )}

        {work.length > 0 && (
          <section>
            <Heading>Experience</Heading>
            <div className="flex flex-col gap-5">
              {work.map((role) => (
                <div key={role._id} className="flex break-inside-avoid flex-col gap-1.5">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="m-0 text-15 font-semibold">
                      {role.title} · {role.organisation}
                    </h3>
                    <span className="font-mono text-12 text-muted">
                      {dateRange(role.startDate ?? '', role.endDate, { yearsOnly: role.yearsOnly })}
                    </span>
                  </div>
                  {role.highlights && role.highlights.length > 0 && (
                    <ul className="m-0 flex list-disc flex-col gap-0.75 pl-4.5 text-14 leading-[1.6] text-body">
                      {role.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <section>
            <Heading>Projects</Heading>
            <div className="flex flex-col gap-3.5">
              {featured.map((project) => (
                <div key={project._id} className="flex break-inside-avoid flex-col gap-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="m-0 text-15 font-semibold">{project.title}</h3>
                    <span className="font-mono text-12 text-muted">
                      {[...(project.tools ?? []), STATUS_WORDS[stegaClean(project.status) ?? '']]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </div>
                  <p className="m-0 text-14 leading-[1.6] text-body">{project.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(skillRows.length > 0 || education.length > 0) && (
          <section className="flex flex-wrap gap-8">
            {skillRows.length > 0 && (
              <div className="min-w-0 flex-[1.3_1_320px]">
                <Heading>Skills</Heading>
                <dl className="m-0 flex flex-col gap-1.5 text-14 leading-normal">
                  {skillRows.map((row) => (
                    <div key={row.tier} className="flex gap-2.5">
                      <dt className="w-24 shrink-0 font-semibold">{SKILL_TIERS[row.tier]}</dt>
                      <dd className="m-0 text-body">{row.names.join(', ')}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {education.length > 0 && (
              <div className="min-w-0 flex-[1_1_260px]">
                <Heading>Education</Heading>
                <div className="flex flex-col gap-2.5 text-14 leading-normal">
                  {education.map((role) => (
                    <div key={role._id}>
                      <div className="font-semibold">
                        {role.title} ·{' '}
                        {dateRange(role.startDate ?? '', role.endDate, {
                          yearsOnly: role.yearsOnly,
                          ongoing: 'in progress',
                        })}
                      </div>
                      <div className="text-body">
                        {[role.organisation, role.location].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </article>
    </main>
  );
}
