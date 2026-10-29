import { pageMetadata } from '@/lib/metadata';
import { JourneyBrowser } from '@/components/sections/journey-browser';
import { PageHero } from '@/components/ui/page-hero';
import { monthYear } from '@/lib/format';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { CREDENTIALS_QUERY, MILESTONES_QUERY, PAGE_COPY_QUERY } from '@/sanity/queries';

export const generateMetadata = () => pageMetadata('journey', '/journey');

export default async function JourneyPage() {
  const dynamic = await getDynamicFetchOptions();
  return <JourneyContent {...dynamic} />;
}

async function JourneyContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: copy }, { data: milestones }, { data: credentials }] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: MILESTONES_QUERY, perspective, stega }),
    cachedSanity({ query: CREDENTIALS_QUERY, perspective, stega }),
  ]);

  const done = milestones.filter((m) => !m.planned);
  const upcoming = milestones.length - done.length;
  const years = done
    .map((m) => m.sortDate?.slice(0, 4))
    .filter((y): y is string => Boolean(y))
    .sort();
  const span =
    years.length > 0
      ? years[0] === years[years.length - 1]
        ? years[0]
        : `${years[0]}–${years[years.length - 1]?.slice(2)}`
      : null;

  const stats = [
    { label: 'Milestones', value: String(done.length) },
    ...(span ? [{ label: 'Span', value: span }] : []),
    { label: 'Upcoming', value: String(upcoming) },
  ];

  return (
    <main id="main">
      <div className="bg-surface">
        {copy?.journey?.heading && (
          <PageHero
            kicker="Journey"
            heading={copy.journey.heading}
            intro={copy.journey.intro}
            aside={
              <dl className="m-0 flex min-w-0 flex-[0_1_360px] border border-rule-strong font-mono">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex-1 border-rule px-4.5 py-4 not-last:border-r"
                  >
                    <dt className="text-11 tracking-label text-muted uppercase">{stat.label}</dt>
                    <dd className="m-0 mt-1.5 text-24 font-medium whitespace-nowrap">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            }
          />
        )}
      </div>
      <JourneyBrowser milestones={milestones} />

      <section aria-labelledby="cred-h" className="border-t border-rule-strong bg-surface">
        <div className="mx-auto flex max-w-page flex-col gap-6 px-4 pt-16 pb-22 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-12 tracking-label text-signal uppercase">
                Credentials
              </span>
              <h2 id="cred-h" className="m-0 text-34 font-semibold tracking-heading lg:text-40">
                Certifications — verifiable only.
              </h2>
            </div>
            <span className="font-mono text-12 text-muted">
              Every entry links to the issuer&apos;s verification page.
            </span>
          </div>
          {credentials.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {credentials.map((credential) => (
                <article
                  key={credential._id}
                  className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5 border border-rule-strong p-7"
                >
                  <h3 className="m-0 text-22 font-semibold">{credential.name}</h3>
                  <dl className="m-0 flex flex-wrap gap-x-7 gap-y-2 font-mono text-13">
                    <div>
                      <dt className="text-11 text-muted">ISSUER</dt>
                      <dd className="m-0 mt-1">{credential.issuer}</dd>
                    </div>
                    {credential.issued && (
                      <div>
                        <dt className="text-11 text-muted">ISSUED</dt>
                        <dd className="m-0 mt-1">{monthYear(credential.issued)}</dd>
                      </div>
                    )}
                    {credential.credentialId && (
                      <div>
                        <dt className="text-11 text-muted">CREDENTIAL ID</dt>
                        <dd className="m-0 mt-1">{credential.credentialId}</dd>
                      </div>
                    )}
                  </dl>
                  {credential.verifyUrl && (
                    <a
                      href={credential.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-14 font-medium no-underline"
                    >
                      Verify with issuer ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-2.5 border border-rule-strong bg-ground p-7">
              <p className="m-0 text-18 leading-normal font-medium">None listed yet.</p>
              <p className="m-0 text-15 leading-[1.6] text-body">
                This section stays empty until there is a certificate a reviewer can verify.
                Projects above are the evidence for now.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
