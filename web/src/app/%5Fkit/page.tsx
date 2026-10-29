import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import { CoverageMark, type CoverageState } from '@/components/ui/coverage-mark';
import { EmptyState } from '@/components/ui/empty-state';
import { EvidenceLedger } from '@/components/ui/evidence-ledger';
import { Figure } from '@/components/ui/figure';
import { FilterButton } from '@/components/ui/filter-button';
import { SectionBar } from '@/components/ui/section-bar';
import { SpecStrip } from '@/components/ui/spec-strip';
import { StatusChip, type ProjectStatus } from '@/components/ui/status-chip';

// Dev-only component sheet. Sample strings below are kit fixtures, not site content.
export const metadata: Metadata = { title: 'UI kit', robots: { index: false } };

const statuses: ProjectStatus[] = [
  'live',
  'inDevelopment',
  'shipsWithSite',
  'learningLab',
  'planned',
];
const coverage: CoverageState[] = ['implemented', 'lab', 'planned', 'none'];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border border-rule-strong bg-surface p-6">
      <h2 className="m-0 font-mono text-12 tracking-label text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Sheet({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div data-theme={theme} className="bg-ground px-4 py-10 text-ink md:px-14">
      <div className="mx-auto flex max-w-page flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule-strong pb-5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-12 tracking-label text-signal uppercase">
              Labbai Irfan Portfolio · kit · {theme}
            </span>
            <h1 className="m-0 text-48 font-semibold tracking-title">Components &amp; states</h1>
          </div>
        </header>

        <SectionBar title="01 — Work" meta={{ label: 'All projects →', href: '#' }} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Actions">
            <div className="flex flex-col gap-2.5">
              <Button href="#">Primary →</Button>
              <Button href="#" variant="secondary">
                Secondary
              </Button>
              <Button variant="dark">Résumé ↓</Button>
            </div>
          </Card>

          <Card title="Status chips">
            <ul className="m-0 flex list-none flex-col items-start gap-3 p-0">
              {statuses.map((status) => (
                <li key={status}>
                  <StatusChip status={status} />
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Evidence ledger">
            <EvidenceLedger
              rows={[
                { label: 'Repository', href: 'https://example.com/repo', meta: 'example.com' },
                { label: 'Case study', href: '#', meta: 'read →' },
                { label: 'Hidden: no link', href: null, meta: '—' },
              ]}
            />
            <span className="text-12 text-muted">Third row has no link and is not rendered.</span>
          </Card>

          <Card title="Spec strip · build stamp">
            <SpecStrip
              items={[
                { label: 'Must', value: 'Requirement text' },
                { label: 'Must not', value: 'Constraint text' },
                { label: 'Runs on', value: null },
              ]}
            />
            <SpecStrip
              variant="stamp"
              items={[
                { label: 'Commit', value: 'a1b2c3d' },
                { label: 'Built', value: '2026-10-28' },
                { label: 'Checks', value: 'passed' },
              ]}
            />
            <span className="text-12 text-muted">Cells without a value are not rendered.</span>
          </Card>

          <Card title="Coverage marks">
            <ul className="m-0 flex list-none flex-wrap gap-5 p-0">
              {coverage.map((state) => (
                <li key={state} className="flex items-center gap-2 text-13">
                  <CoverageMark state={state} />
                  <span aria-hidden="true">{state}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Filters · pressed and default">
            <div className="flex flex-wrap gap-2">
              <FilterButton label="All" count={5} pressed />
              <FilterButton label="Learning lab" count={2} pressed={false} />
            </div>
          </Card>

          <Card title="Code block">
            <CodeBlock
              filename="scripts/example.sh"
              code={'#!/usr/bin/env bash\necho "kit fixture"'}
            />
          </Card>

          <Card title="Figure">
            <Figure
              label="Fig. 1 — Kit fixture"
              caption="In words: a sample box links to a second sample box."
              badge={<StatusChip status="learningLab" />}
            >
              <div className="flex items-center justify-center gap-3.5">
                <div className="border border-rule-strong bg-surface px-3 py-4 text-14 font-semibold">
                  Box A
                </div>
                <span aria-hidden="true" className="text-signal">
                  →
                </span>
                <div className="bg-contrast px-3 py-4 text-14 font-semibold text-on-contrast">
                  Box B
                </div>
              </div>
            </Figure>
          </Card>

          <Card title="Empty and pending states">
            <div className="grid gap-3 sm:grid-cols-2">
              <EmptyState
                label="No results"
                title="No results for “aws”"
                action={{ label: 'Try the terminal →', href: '#' }}
              />
              <EmptyState
                mono
                label="Not measured"
                title="Uptime · not measured yet"
                detail="Never a fake number"
              />
              <EmptyState
                label="None yet"
                title="No certifications listed"
                detail="Until one is verifiable"
              />
            </div>
          </Card>

          <Card title="Focus, contrast and motion">
            <div className="flex flex-wrap items-center gap-8">
              <Button>Tab to me</Button>
              <a href="#">Focusable link</a>
            </div>
            <span className="text-14 leading-[1.6] text-body">
              Tab through this page: every control shows a 2px Signal ring with a 3px offset.
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function KitPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main id="main">
      <Sheet theme="light" />
      <Sheet theme="dark" />
    </main>
  );
}
