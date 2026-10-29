import { Suspense } from 'react';
import { RequestPanel } from '@/components/sections/request-panel';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/metadata';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { PAGE_COPY_QUERY } from '@/sanity/queries';

export const generateMetadata = () => pageMetadata('notFound', '/404');

export default async function NotFound() {
  const dynamic = await getDynamicFetchOptions();
  return <NotFoundContent {...dynamic} />;
}

async function NotFoundContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const { data: copy } = await cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega });

  return (
    <main id="main" className="flex-1 bg-grid">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-12 px-4 py-16 lg:px-10 lg:py-24">
        <div className="flex min-w-0 flex-[1.2_1_420px] flex-col gap-6">
          <span className="font-mono text-12 tracking-label text-signal uppercase">Error 404</span>
          <h1 className="m-0 text-48 leading-none font-semibold tracking-title lg:text-72">
            {copy?.notFound?.heading}
          </h1>
          {copy?.notFound?.intro && (
            <p className="m-0 max-w-140 text-17 leading-[1.6] text-body">{copy.notFound.intro}</p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/">Back to home</Button>
            <Button href="/work" variant="secondary">
              See the work
            </Button>
            <Button href="/contact" variant="ghost">
              Report a broken link
            </Button>
          </div>
        </div>
        <Suspense fallback={null}>
          <RequestPanel />
        </Suspense>
      </div>
    </main>
  );
}
