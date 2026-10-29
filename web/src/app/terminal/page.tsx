import { pageMetadata } from '@/lib/metadata';
import { Terminal } from '@/components/terminal/terminal';
import { PageHero } from '@/components/ui/page-hero';
import { buildTerminalData } from '@/lib/terminal-data';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import {
  INFRA_QUERY,
  MILESTONES_QUERY,
  PAGE_COPY_QUERY,
  PROJECTS_QUERY,
  ROLES_QUERY,
  SETTINGS_QUERY,
  SKILLS_QUERY,
} from '@/sanity/queries';

export const generateMetadata = () => pageMetadata('terminal', '/terminal');

export default async function TerminalPage() {
  const dynamic = await getDynamicFetchOptions();
  return <TerminalContent {...dynamic} />;
}

async function TerminalContent({ perspective }: DynamicFetchOptions) {
  'use cache';
  // Terminal output is plain text, so it is fetched without stega markers.
  const stega = false;
  const [copy, settings, projects, skills, roles, milestones, infra] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
    cachedSanity({ query: PROJECTS_QUERY, perspective, stega }),
    cachedSanity({ query: SKILLS_QUERY, perspective, stega }),
    cachedSanity({ query: ROLES_QUERY, perspective, stega }),
    cachedSanity({ query: MILESTONES_QUERY, perspective, stega }),
    cachedSanity({ query: INFRA_QUERY, perspective, stega }),
  ]);
  const data = buildTerminalData({
    settings: settings.data,
    projects: projects.data,
    skills: skills.data,
    roles: roles.data,
    milestones: milestones.data,
    infra: infra.data,
  });

  return (
    <main id="main">
      {copy.data?.terminal?.heading && (
        <PageHero
          kicker="Terminal"
          heading={copy.data.terminal.heading}
          intro={copy.data.terminal.intro}
          className="pb-6"
        />
      )}
      <Terminal data={data} />
    </main>
  );
}
