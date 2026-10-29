import { pageMetadata } from '@/lib/metadata';
import { CalloutBanner } from '@/components/ui/callout-banner';
import { PageHero } from '@/components/ui/page-hero';
import { WorkBrowser } from '@/components/sections/work-browser';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { PAGE_COPY_QUERY, PROJECTS_QUERY } from '@/sanity/queries';

export const generateMetadata = () => pageMetadata('work', '/work');

export default async function WorkPage() {
  const dynamic = await getDynamicFetchOptions();
  return <WorkContent {...dynamic} />;
}

async function WorkContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: copy }, { data: projects }] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: PROJECTS_QUERY, perspective, stega }),
  ]);

  return (
    <main id="main">
      <div className="bg-surface">
        {copy?.work?.heading && (
          <PageHero
            kicker="Work"
            heading={copy.work.heading}
            intro={copy.work.intro}
            className="pb-10"
          />
        )}
      </div>
      <WorkBrowser projects={projects} />
      <div className="mx-auto max-w-page px-4 pb-22 lg:px-10">
        <CalloutBanner
          text="Want to see how I work through a real problem?"
          action={{ label: 'Read the debugging notes →', href: '/notes' }}
        />
      </div>
    </main>
  );
}
