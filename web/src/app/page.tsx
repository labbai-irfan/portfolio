import type { ReactNode } from 'react';
import { stegaClean } from '@/lib/stega';
import { PersonJsonLd } from '@/components/seo/person-json-ld';
import { HomeContact } from '@/components/sections/home/home-contact';
import { HomeHero } from '@/components/sections/home/home-hero';
import { HomeInfra } from '@/components/sections/home/home-infra';
import { HomeJourney } from '@/components/sections/home/home-journey';
import { HomeNotes } from '@/components/sections/home/home-notes';
import { HomeSummary } from '@/components/sections/home/home-summary';
import { HomeTerminal } from '@/components/sections/home/home-terminal';
import { HomeWork } from '@/components/sections/home/home-work';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { HOME_QUERY, PAGE_COPY_QUERY, SETTINGS_QUERY } from '@/sanity/queries';

export default async function HomePage() {
  const dynamic = await getDynamicFetchOptions();
  return <HomeContent {...dynamic} />;
}

async function HomeContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: settings }, { data: copy }, { data: home }] = await Promise.all([
    cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: HOME_QUERY, perspective, stega }),
  ]);

  const flagship = home.home?.featuredProject ?? null;
  const featured = [...(flagship ? [flagship] : []), ...home.otherFeatured];
  const pipeline = featured.find((project) => stegaClean(project.layout) === 'pipeline');

  // Studio decides which sections show, and in what order; the numbers follow that order.
  const visible = (home.home?.sections ?? []).filter((s) => s.visible !== false);
  const sections: Record<string, (index: number) => ReactNode> = {
    work: (index) => <HomeWork index={index} flagship={flagship} others={home.otherFeatured} />,
    terminal: (index) => <HomeTerminal index={index} settings={settings} projects={featured} />,
    infrastructure: (index) => (
      <HomeInfra index={index} nodes={home.infraTeaser} status={home.siteStatus} />
    ),
    journey: (index) => (
      <HomeJourney index={index} recent={home.recentMilestones} next={home.nextMilestone} />
    ),
    notes: (index) => <HomeNotes index={index} note={home.latestNote} />,
    contact: (index) => (
      <HomeContact index={index} heading={copy?.contact?.heading ?? null} settings={settings} />
    ),
  };

  return (
    <main id="main">
      <PersonJsonLd />
      <HomeHero
        settings={settings}
        pipelineHref={pipeline?.slug ? `/work/${pipeline.slug}` : null}
      />
      <HomeSummary cells={settings?.summaryCells ?? null} />
      {visible.map((section, index) => (
        <div key={section._key}>{sections[stegaClean(section.section) ?? '']?.(index)}</div>
      ))}
    </main>
  );
}
