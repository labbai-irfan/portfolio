import Link from 'next/link';
import { Suspense } from 'react';
import { SearchButton } from '@/components/search/search-button';
import { Button } from '@/components/ui/button';
import { shortName } from '@/lib/format';
import { cachedSanity, type DynamicFetchOptions } from '@/sanity/live';
import { SETTINGS_QUERY } from '@/sanity/queries';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';

export async function SiteHeader({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const { data: settings } = await cachedSanity({ query: SETTINGS_QUERY, perspective, stega });

  return (
    <header className="sticky top-0 z-20 border-b border-rule-strong bg-surface print:hidden">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-3 gap-y-0 px-4 lg:px-10"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex min-h-17 items-center gap-2.5 text-ink no-underline lg:gap-3"
          >
            <span className="relative flex size-8.5 items-center justify-center bg-contrast font-mono text-13 font-semibold text-on-contrast">
              IN
              <span aria-hidden="true" className="absolute -right-1 -bottom-1 size-2.5 bg-signal" />
            </span>
            <span className="text-15 font-semibold tracking-tight">
              <span className="hidden lg:inline">{settings?.name}</span>
              <span className="lg:hidden">{settings?.name ? shortName(settings.name) : null}</span>
            </span>
          </Link>
          {settings?.openToRoles && (
            <span className="hidden items-center gap-2 bg-progress-bg px-2.5 py-1.5 font-mono text-11 tracking-chip text-progress uppercase lg:flex">
              <span aria-hidden="true" className="size-1.75 bg-signal" />
              Open to roles
            </span>
          )}
        </div>

        <div className="hidden items-center lg:flex">
          {/* usePathname() is runtime data, so the active-link nav streams in behind Suspense. */}
          <Suspense fallback={null}>
            <DesktopNav />
          </Suspense>
          <SearchButton />
          <ThemeToggle className="ml-2" />
          <Button href="/resume" variant="dark" className="ml-2">
            Résumé
          </Button>
        </div>

        <Suspense fallback={null}>
          <MobileNav
            name={settings?.name ? shortName(settings.name) : null}
            githubUrl={settings?.githubUrl}
            linkedinUrl={settings?.linkedinUrl}
          />
        </Suspense>
      </nav>
    </header>
  );
}
