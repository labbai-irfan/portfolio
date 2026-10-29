import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { PAGE_COPY_QUERY, SETTINGS_QUERY } from '@/sanity/queries';

const channelClass =
  'flex min-h-20 flex-1 items-center justify-between gap-4 border-rule-strong px-8 text-20 font-medium text-ink no-underline hover:text-signal-hover not-last:border-b';

export const generateMetadata = () => pageMetadata('contact', '/contact');

export default async function ContactPage() {
  const dynamic = await getDynamicFetchOptions();
  return <ContactContent {...dynamic} />;
}

async function ContactContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: copy }, { data: settings }] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
  ]);

  const email = settings?.email;
  const links: Array<{ label: string; href: string }> = [];
  if (settings?.linkedinUrl) links.push({ label: 'LinkedIn', href: settings.linkedinUrl });
  if (settings?.githubUrl) links.push({ label: 'GitHub', href: settings.githubUrl });
  for (const social of settings?.socials ?? [])
    links.push({ label: social.label, href: social.url });

  const looking = [
    settings?.rolesWanted?.length && { label: 'Roles', value: settings.rolesWanted.join(', ') },
    settings?.workPreference && { label: 'Where', value: settings.workPreference },
    settings?.availability && { label: 'Availability', value: settings.availability },
  ].filter((cell): cell is { label: string; value: string } => Boolean(cell));

  return (
    // This page is always dark, like the Contact band on Home: the dark token set is applied
    // to the subtree, so the theme toggle does not change it.
    <main id="main" data-theme="dark" className="bg-ground text-ink">
      <section className="mx-auto flex max-w-page flex-col gap-6 px-4 pt-24 pb-16 lg:px-10">
        <span className="font-mono text-12 tracking-label text-muted uppercase">Contact</span>
        {copy?.contact?.heading && (
          <h1 className="m-0 max-w-275 text-48 font-semibold tracking-title lg:text-112">
            {copy.contact.heading}
          </h1>
        )}
        {copy?.contact?.intro && (
          <p className="m-0 max-w-160 text-18 leading-[1.55] text-body lg:text-20">
            {copy.contact.intro}
          </p>
        )}
      </section>

      <section
        aria-label="Channels"
        className="mx-auto flex max-w-page flex-wrap px-4 pb-18 lg:px-10"
      >
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex min-h-60 min-w-0 flex-[1.4_1_320px] flex-col justify-between gap-12 bg-signal p-8 text-on-signal no-underline hover:text-on-signal lg:flex-[1.4_1_480px] lg:p-10"
          >
            <span className="font-mono text-12 tracking-label uppercase">Preferred · Email</span>
            <span className="flex items-end justify-between gap-4">
              <span className="text-26 font-semibold tracking-lead break-all lg:text-36">
                {email}
              </span>
              <span aria-hidden="true" className="text-32">
                →
              </span>
            </span>
          </a>
        )}
        <div
          className={`flex min-w-0 flex-[1_1_320px] flex-col border border-rule-strong lg:flex-[1_1_360px] ${email ? 'lg:border-l-0' : ''}`}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={channelClass}
            >
              {link.label}
              <span className="font-mono text-13 font-normal text-muted">
                ↗<span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          ))}
          <Link href="/resume" className={channelClass}>
            Résumé
            <span className="font-mono text-13 font-normal text-muted">view or download →</span>
          </Link>
        </div>
      </section>

      {looking.length > 0 && (
        <section aria-labelledby="fit-h" className="border-t border-rule-strong">
          <div className="mx-auto flex max-w-page flex-col gap-7 px-4 pt-16 pb-24 lg:px-10">
            <h2 id="fit-h" className="m-0 text-32 font-semibold tracking-lead">
              What I&apos;m looking for
            </h2>
            <dl className="m-0 flex flex-wrap border border-rule-strong">
              {looking.map((cell) => (
                <div
                  key={cell.label}
                  className="flex min-w-0 flex-[1_1_260px] flex-col gap-2.5 border-rule-strong p-7 not-last:border-r"
                >
                  <dt className="font-mono text-11 tracking-label text-muted uppercase">
                    {cell.label}
                  </dt>
                  <dd className="m-0 text-17 leading-[1.55]">{cell.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
    </main>
  );
}
