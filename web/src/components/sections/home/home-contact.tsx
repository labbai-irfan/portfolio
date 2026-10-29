import { Button } from '@/components/ui/button';
import { sectionNumber } from '@/lib/format';
import type { Fetched } from '@/lib/stega';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

type HomeContactProps = {
  index: number;
  heading: string | null;
  settings: Fetched<SETTINGS_QUERY_RESULT>;
};

/** The closing dark band. Channels without a real value are not rendered. */
export function HomeContact({ index, heading, settings }: HomeContactProps) {
  const links: Array<{ label: string; href: string }> = [];
  if (settings?.linkedinUrl) links.push({ label: 'LinkedIn', href: settings.linkedinUrl });
  if (settings?.githubUrl) links.push({ label: 'GitHub', href: settings.githubUrl });
  const email = settings?.email;
  // With nothing to show but the heading, the band would be a dead end; send people to /contact.
  const hasChannels = Boolean(email) || links.length > 0;

  return (
    <section aria-labelledby="home-contact" className="bg-bar text-on-bar">
      <div className="mx-auto flex max-w-page flex-wrap items-end gap-14 px-4 py-16 lg:px-10 lg:py-24">
        <div className="flex min-w-0 flex-[1.4_1_320px] flex-col gap-5 lg:flex-[1.4_1_520px]">
          <p className="m-0 font-mono text-12 tracking-label text-on-bar-meta uppercase">
            {sectionNumber(index)} — Contact
          </p>
          {heading && (
            <h2
              id="home-contact"
              className="m-0 text-36 leading-none font-semibold tracking-title lg:text-64"
            >
              {heading}
            </h2>
          )}
        </div>
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3 lg:flex-[1_1_360px]">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex min-h-15 items-center justify-between gap-4 bg-term-prompt px-6 text-17 font-medium text-bar no-underline hover:text-bar"
            >
              {email}
              <span aria-hidden="true">→</span>
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
                  className="flex min-h-13 flex-1 items-center justify-center border border-term-control text-15 text-on-bar no-underline hover:text-on-bar"
                >
                  {link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          )}
          {!hasChannels && (
            <Button href="/contact" variant="onBar">
              Get in touch →
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
