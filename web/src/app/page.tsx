import type { ReactNode } from 'react';
import { Hero } from '@/components/home/hero';
import { PersonJsonLd } from '@/components/seo/person-json-ld';
import { EngineeringOverview } from '@/components/sections/home/engineering-overview';
import { EngineeringPipeline } from '@/components/sections/home/engineering-pipeline';
import { FlagshipTile } from '@/components/sections/home/flagship-tile';
import { HomeContact } from '@/components/sections/home/home-contact';
import { HomeInfra } from '@/components/sections/home/home-infra';
import { HomeJourney } from '@/components/sections/home/home-journey';
import { HomeNotes } from '@/components/sections/home/home-notes';
import { HomeTerminal } from '@/components/sections/home/home-terminal';
import { ProjectTile } from '@/components/sections/home/project-tile';
import { Tilt } from '@/components/ui/tilt';
import { ContainerYard } from '@/components/yard/container-yard';
import { packRows } from '@/lib/bento';
import { stegaClean } from '@/lib/stega';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { HOME_QUERY, PAGE_COPY_QUERY, SETTINGS_QUERY, SKILLS_QUERY } from '@/sanity/queries';

// Tailwind only ships classes it can see written out, so every span is listed.
const LG_SPAN: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
};
const MD_SPAN: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
};

/** One bento cell: its preferred width on desktop (of 12) and tablet (of 6), and how to draw it. */
type BentoTile = { key: string; lg: number; md: number; render: (className: string) => ReactNode };

export default async function HomePage() {
  const dynamic = await getDynamicFetchOptions();
  return <HomeContent {...dynamic} />;
}

async function HomeContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: settings }, { data: copy }, { data: home }, { data: skills }] = await Promise.all([
    cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: HOME_QUERY, perspective, stega }),
    cachedSanity({ query: SKILLS_QUERY, perspective, stega }),
  ]);

  const flagship = home.home?.featuredProject ?? null;
  const featured = [...(flagship ? [flagship] : []), ...home.otherFeatured];

  // Below the hero: the Studio's sections, in the Studio's order; hidden or empty ones add no tile.
  const tiles: BentoTile[] = [];
  const visible = (home.home?.sections ?? []).filter((s) => s.visible !== false);
  for (const section of visible) {
    switch (stegaClean(section.section)) {
      case 'work':
        if (flagship) {
          tiles.push({
            key: 'flagship',
            lg: 8,
            md: 6,
            render: (c) => <FlagshipTile project={flagship} className={c} />,
          });
        }
        for (const project of home.otherFeatured) {
          if (!project.slug) continue;
          tiles.push({
            key: project._id,
            lg: 4,
            md: 3,
            render: (c) => <ProjectTile project={project} className={c} />,
          });
        }
        break;
      case 'terminal':
        tiles.push({
          key: 'terminal',
          lg: 6,
          md: 6,
          render: (c) => <HomeTerminal settings={settings} projects={featured} className={c} />,
        });
        break;
      case 'infrastructure':
        if (home.infraTeaser.length > 0) {
          tiles.push({
            key: 'infra',
            lg: 6,
            md: 6,
            render: (c) => <HomeInfra nodes={home.infraTeaser} className={c} />,
          });
        }
        break;
      case 'journey':
        if (home.recentMilestones.length > 0 || home.nextMilestone?.title) {
          tiles.push({
            key: 'journey',
            lg: 7,
            md: 6,
            render: (c) => (
              <HomeJourney recent={home.recentMilestones} next={home.nextMilestone} className={c} />
            ),
          });
        }
        break;
      case 'notes':
        if (home.latestNote?.slug) {
          tiles.push({
            key: 'notes',
            lg: 5,
            md: 6,
            render: (c) => <HomeNotes note={home.latestNote} className={c} />,
          });
        }
        break;
      case 'contact':
        tiles.push({
          key: 'contact',
          lg: 12,
          md: 6,
          render: (c) => (
            <HomeContact
              heading={copy?.contact?.heading ?? null}
              settings={settings}
              className={c}
            />
          ),
        });
        break;
    }
  }

  // Widths are adjusted so every row is exactly full at each breakpoint, whatever the order.
  const lg = packRows(
    tiles.map((t) => ({ item: t, prefer: t.lg })),
    12,
  );
  const md = packRows(
    tiles.map((t) => ({ item: t, prefer: t.md })),
    6,
  );

  return (
    <main id="main">
      <PersonJsonLd />
      <div className="ambient">
        <Hero settings={settings} />
      </div>
      <ContainerYard skills={skills} />
      <EngineeringPipeline />
      <EngineeringOverview
        status={home.siteStatus}
        summaryCells={settings?.summaryCells ?? []}
        className="mx-auto max-w-page px-4 py-8 reveal lg:px-10"
      />
      <div className="mx-auto max-w-page px-4 pb-6 md:pb-8 lg:px-10 lg:pb-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12 lg:gap-5">
          {lg.map(({ item, span }, i) => (
            // Each cell tilts toward the pointer and reveals on scroll; the tile inside fills the
            // cell's full row height.
            <Tilt
              key={item.key}
              className={`grid reveal ${MD_SPAN[md[i]?.span ?? 6]} ${LG_SPAN[span]}`}
            >
              {item.render('')}
            </Tilt>
          ))}
        </div>
      </div>
    </main>
  );
}
