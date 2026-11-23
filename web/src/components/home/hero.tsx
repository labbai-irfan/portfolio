import Link from 'next/link';
import { HeroTerminal } from '@/components/terminal/hero-terminal';
import { OpenTerminalButton } from '@/components/terminal/open-terminal-button';
import { Button } from '@/components/ui/button';
import type { Fetched } from '@/lib/stega';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

/**
 * The home hero: who, what and how on the left — set on the page, not in a box — and the live
 * terminal on the right. Every word comes from Site settings.
 */
export function Hero({ settings }: { settings: Fetched<SETTINGS_QUERY_RESULT> }) {
  const tech = settings?.heroTech ?? [];
  const status = [settings?.location, settings?.availability].filter(Boolean);

  return (
    <section
      aria-labelledby="hero-name"
      className="mx-auto max-w-page px-4 pt-14 pb-16 md:pt-18 lg:px-10 lg:pt-20 lg:pb-22"
    >
      <div className="grid items-start gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-6 lg:pt-2">
          {settings?.headlineLabel && (
            // The one deliberate letter-spaced label on the site: the role, above the name.
            <p className="m-0 font-mono text-13 tracking-label text-signal uppercase">
              {settings.headlineLabel}
            </p>
          )}
          <h1
            id="hero-name"
            className="m-0 mt-5 text-display font-semibold tracking-display text-balance"
          >
            {settings?.name}
          </h1>
          <p className="m-0 mt-8 max-w-[20ch] text-28 leading-[1.12] font-semibold tracking-heading text-balance md:text-38">
            {settings?.heroLine}
          </p>
          {settings?.heroParagraph && (
            <p className="m-0 mt-5 max-w-[56ch] text-17 leading-[1.6] text-body md:text-18">
              {settings.heroParagraph}
            </p>
          )}
          {tech.length > 0 && (
            <ul
              aria-label="Technologies"
              className="m-0 mt-6 flex list-none flex-wrap items-center gap-x-2.5 gap-y-1 p-0 font-mono text-13 text-muted"
            >
              {tech.map((item, index) => (
                // The separator trails its item, so a wrapped line never starts with a slash.
                <li key={item} className="flex items-center gap-x-2.5">
                  {item}
                  {index < tech.length - 1 && (
                    <span aria-hidden="true" className="text-rule-dashed">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button href="/work">Explore my work</Button>
            <OpenTerminalButton growFrom="hero-terminal" className="max-md:hidden">
              Open terminal
            </OpenTerminalButton>
            <Link href="/contact" className="flex min-h-11 items-center text-15 font-medium">
              Get in touch
            </Link>
          </div>

          {(settings?.openToRoles || status.length > 0) && (
            <p className="m-0 mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 text-14 text-muted">
              {settings?.openToRoles && (
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span aria-hidden="true" className="size-2 rounded-full bg-live" />
                  Open to roles
                </span>
              )}
              {status.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          )}
        </div>

        <HeroTerminal className="lg:col-span-6" />
      </div>
    </section>
  );
}
