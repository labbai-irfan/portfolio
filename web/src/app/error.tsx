'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Shown when a page throws while rendering. It sits inside the normal header and footer, offers a
 * retry and a way home, and shows the error's digest (a reference for the server logs), never its
 * message. This wording is fixed interface text: an error page can't depend on the CMS being up.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex-1 bg-grid">
      <div className="mx-auto flex max-w-page flex-col items-start gap-6 px-4 py-16 lg:px-10 lg:py-24">
        <span className="font-mono text-12 tracking-label text-signal uppercase">Error 500</span>
        <h1 className="m-0 max-w-200 text-48 leading-none font-semibold tracking-title lg:text-72">
          This page hit a problem.
        </h1>
        <p className="m-0 max-w-140 text-17 leading-[1.6] text-body">
          Something went wrong while loading it. Trying again usually works; if it doesn’t, the rest
          of the site is still available.
        </p>
        {error.digest && (
          <p className="m-0 font-mono text-12 text-muted">reference: {error.digest}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
          <Link href="/contact" className="inline-flex min-h-13 items-center px-3 text-15">
            Report a problem
          </Link>
        </div>
      </div>
    </main>
  );
}
