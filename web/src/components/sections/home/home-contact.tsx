import { Button } from '@/components/ui/button';
import { Tile } from '@/components/ui/tile';
import type { Fetched } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

type HomeContactProps = {
  heading: string | null;
  settings: Fetched<SETTINGS_QUERY_RESULT>;
  className?: string;
};

/** The closing tile. Channels without a real value are not rendered. */
export function HomeContact({ heading, settings, className }: HomeContactProps) {
  const links: Array<{ label: string; href: string }> = [];
  if (settings?.linkedinUrl) links.push({ label: 'LinkedIn', href: settings.linkedinUrl });
  if (settings?.githubUrl) links.push({ label: 'GitHub', href: settings.githubUrl });
  const email = settings?.email;
  // With nothing to show but the heading, the tile would be a dead end; send people to /contact.
  const hasChannels = Boolean(email) || links.length > 0;

  return (
    <Tile
      as="section"
      tone="dark"
      labelledBy="home-contact"
      className={cx('flex flex-wrap items-end gap-x-14 gap-y-8 p-7 md:p-10 lg:p-12', className)}
    >
      <div className="flex min-w-0 flex-[1.4_1_320px] flex-col gap-4">
        <p className="m-0 text-14 font-medium text-on-bar-meta">Contact</p>
        {heading && (
          <h2
            id="home-contact"
            className="m-0 text-36 leading-none font-semibold tracking-title text-balance lg:text-56"
          >
            {heading}
          </h2>
        )}
      </div>
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex min-h-15 items-center rounded-control bg-term-prompt px-6 text-17 font-medium break-all text-bar no-underline hover:text-bar"
          >
            {email}
          </a>
        )}
        {links.length > 0 && (
          <div className="flex gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-13 flex-1 items-center justify-center rounded-control border border-term-control text-15 text-on-bar no-underline hover:text-on-bar"
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        )}
        {!hasChannels && (
          <Button href="/contact" variant="onBar">
            Get in touch
          </Button>
        )}
      </div>
    </Tile>
  );
}
