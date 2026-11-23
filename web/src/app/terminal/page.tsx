import { Terminal } from '@/components/terminal/terminal';
import { PageHero } from '@/components/ui/page-hero';
import { pageMetadata } from '@/lib/metadata';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { PAGE_COPY_QUERY } from '@/sanity/queries';

export const generateMetadata = () => pageMetadata('terminal', '/terminal');

export default async function TerminalPage() {
  const dynamic = await getDynamicFetchOptions();
  return <TerminalContent {...dynamic} />;
}

// The terminal itself (and its data) is mounted site-wide by TerminalHost in the root layout;
// this page shows that same session at full size.
async function TerminalContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const { data: copy } = await cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega });
  return (
    <main id="main">
      {copy?.terminal?.heading && (
        <PageHero
          kicker="Terminal"
          heading={copy.terminal.heading}
          intro={copy.terminal.intro}
          className="pb-6"
        />
      )}
      <Terminal />
    </main>
  );
}
