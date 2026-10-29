import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { Topology } from '@/components/sections/topology';
import { PageHero } from '@/components/ui/page-hero';
import { getBuildInfo } from '@/lib/build-info';
import { stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import { cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions } from '@/sanity/live';
import { INFRA_QUERY, PAGE_COPY_QUERY, SITE_STATUS_QUERY } from '@/sanity/queries';

export const generateMetadata = () => pageMetadata('infrastructure', '/infrastructure');

export default async function InfrastructurePage() {
  const dynamic = await getDynamicFetchOptions();
  return <InfrastructureContent {...dynamic} />;
}

async function InfrastructureContent({ perspective, stega }: DynamicFetchOptions) {
  'use cache';
  const [{ data: copy }, { data: infra }, { data: status }] = await Promise.all([
    cachedSanity({ query: PAGE_COPY_QUERY, perspective, stega }),
    cachedSanity({ query: INFRA_QUERY, perspective, stega }),
    cachedSanity({ query: SITE_STATUS_QUERY, perspective, stega }),
  ]);
  const { shortSha, builtLabel } = getBuildInfo();

  // Never a made-up number: no probe result yet reads as "not measured yet".
  const cells = [
    { label: 'Status', value: status?.status ?? 'not measured yet' },
    { label: 'Last deploy', value: builtLabel },
    { label: 'Commit', value: shortSha },
    {
      label: 'Uptime',
      value: status?.uptime != null ? `${status.uptime}%` : 'not measured yet',
    },
  ].filter((cell) => cell.value);

  const nodes = infra.map((n) => ({
    id: n._id,
    kicker: n.kicker,
    name: n.name,
    sub: n.sub,
    category: stegaClean(n.category),
    state: stegaClean(n.state),
    role: n.role,
    connections: (n.connections ?? []).map((c) => ({
      key: c._key,
      label: c.label,
      type: stegaClean(c.type),
      target: c.target,
    })),
  }));

  return (
    <main id="main">
      {copy?.infrastructure?.heading && (
        <PageHero
          kicker="Infrastructure"
          heading={copy.infrastructure.heading}
          intro={copy.infrastructure.intro}
          aside={
            <dl className="m-0 min-w-70 flex-[0_1_340px] border border-rule-strong bg-surface font-mono text-13">
              {cells.map((cell, i) => (
                <div
                  key={cell.label}
                  className={cx(
                    'flex justify-between gap-4 px-4.5 py-3',
                    i === 0 ? 'bg-bar text-on-bar' : 'border-rule not-last:border-b',
                  )}
                >
                  <dt className={i === 0 ? 'text-12 tracking-data uppercase' : 'text-muted'}>
                    {cell.label}
                  </dt>
                  <dd className={cx('m-0', i === 0 && 'text-on-bar-meta')}>{cell.value}</dd>
                </div>
              ))}
            </dl>
          }
        />
      )}

      <section aria-labelledby="topo-h" className="mx-auto max-w-page px-4 pb-14 lg:px-10">
        <h2 id="topo-h" className="m-0 mb-6 text-28 font-semibold tracking-heading">
          Topology
        </h2>
        <Topology nodes={nodes} />
      </section>

      <section aria-labelledby="stack-h" className="mx-auto max-w-page px-4 pb-14 lg:px-10">
        <h2 id="stack-h" className="m-0 mb-6 text-28 font-semibold tracking-heading">
          The stack, layer by layer
        </h2>
        <div
          tabIndex={0}
          role="region"
          aria-label="Stack table"
          className="overflow-x-auto border border-rule-strong bg-surface"
        >
          <table className="w-full min-w-160 border-collapse text-left text-15">
            <thead>
              <tr className="font-mono text-11 tracking-label text-muted uppercase">
                <th scope="col" className="border-b border-rule-strong px-5 py-3.5 font-normal">
                  Layer
                </th>
                <th scope="col" className="border-b border-rule-strong px-5 py-3.5 font-normal">
                  Service
                </th>
                <th scope="col" className="border-b border-rule-strong px-5 py-3.5 font-normal">
                  Why
                </th>
                <th scope="col" className="border-b border-rule-strong px-5 py-3.5 font-normal">
                  State
                </th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.id} className="align-top">
                  <th scope="row" className="border-b border-rule px-5 py-4 font-semibold">
                    {node.kicker}
                  </th>
                  <td className="border-b border-rule px-5 py-4 font-mono text-13">
                    {node.name}
                    {node.sub && <span className="block text-muted">{node.sub}</span>}
                  </td>
                  <td className="border-b border-rule px-5 py-4 leading-[1.55] text-body">
                    {node.role}
                  </td>
                  <td className="border-b border-rule px-5 py-4">
                    <span
                      className={cx(
                        'font-mono text-11 tracking-chip uppercase',
                        node.state === 'planned' ? 'text-planned' : 'text-live',
                      )}
                    >
                      {node.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-auto flex max-w-page flex-wrap gap-4 px-4 pb-22 lg:px-10">
        <Link
          href="/terminal"
          className="flex min-h-11 min-w-70 flex-1 flex-col gap-1.5 border border-rule-strong bg-surface p-5 text-ink no-underline hover:bg-ground"
        >
          <span className="font-mono text-11 tracking-label text-muted uppercase">
            Prefer a shell?
          </span>
          <span className="text-17 font-semibold">
            Run <span className="font-mono">infra</span> in the terminal →
          </span>
        </Link>
      </div>
    </main>
  );
}
