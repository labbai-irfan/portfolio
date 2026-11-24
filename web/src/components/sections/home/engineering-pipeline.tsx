'use client';

import { useId, useState, type ReactNode } from 'react';
import { sectionNumber } from '@/lib/format';
import { cx } from '@/lib/utils';

type Stage = { label: string; tech: string; desc: string; icon: ReactNode };

const ICON_PROPS = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const STAGES: Stage[] = [
  {
    label: 'Source',
    tech: 'Git · GitHub',
    desc: 'Code is committed and reviewed before anything runs.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <circle cx="5" cy="4" r="1.6" />
        <circle cx="5" cy="12" r="1.6" />
        <circle cx="11.5" cy="8" r="1.6" />
        <path d="M5 5.6V10.4M6.4 8H9.9M5 5.6c0 1.6 1.3 2.4 3 2.4" />
      </svg>
    ),
  },
  {
    label: 'Test',
    tech: 'Automated tests',
    desc: 'Unit and integration tests gate every change.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
        <path d="M5.2 8.2l1.8 1.8 3.8-3.8" />
      </svg>
    ),
  },
  {
    label: 'Build',
    tech: 'Docker',
    desc: 'The app is built once into a container image.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M8 2l5.2 3v6L8 14 2.8 11V5L8 2Z" />
        <path d="M8 2v6M8 8 2.8 5M8 8l5.2-3M8 8v6" />
      </svg>
    ),
  },
  {
    label: 'Security',
    tech: 'Dependency & image scans',
    desc: 'Images and dependencies are scanned before they ship.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M8 2.2 13 4v4c0 3.4-2.1 5.6-5 6.8-2.9-1.2-5-3.4-5-6.8V4L8 2.2Z" />
        <path d="M5.8 8l1.6 1.6 2.8-2.8" />
      </svg>
    ),
  },
  {
    label: 'Deploy',
    tech: 'AWS',
    desc: 'The scanned image rolls out to production.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M8 13V4.2M5 7.2 8 4l3 3.2" />
        <path d="M3.5 13h9" />
      </svg>
    ),
  },
  {
    label: 'Monitor',
    tech: 'Health checks',
    desc: 'Uptime and health are watched after release.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M2.5 8.5h2.2l1.4-3 1.8 5.4 1.3-2.4h2.3" />
        <circle cx="12.6" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/**
 * How this site ships: a horizontal, six-stage pipeline strip (not six cards). Each stage opens
 * on click to show its tech and a one-line description; otherwise the row stays minimal.
 */
export function EngineeringPipeline({ className }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section aria-labelledby={`${baseId}-heading`} className={cx('grid-backdrop seam', className)}>
      <div className="mx-auto max-w-page px-4 py-12 reveal lg:px-10 lg:py-16">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2
            id={`${baseId}-heading`}
            className="m-0 text-28 leading-[1.1] font-semibold tracking-heading"
          >
            From development to production
          </h2>
          <p className="m-0 text-14 text-muted">Tap a stage for detail</p>
        </div>

        <ol className="relative m-0 flex snap-x snap-mandatory list-none gap-1 overflow-x-auto p-0 pb-2 md:snap-none md:gap-0 md:overflow-visible">
          <span
            aria-hidden="true"
            className="absolute top-5.5 right-6 left-6 hidden h-px bg-rule-dashed md:block"
          />
          {STAGES.map((stage, index) => {
            const expanded = open === index;
            return (
              <li
                key={stage.label}
                className="relative min-w-37 flex-1 snap-start px-1 first:pl-0 last:pr-0 md:min-w-0"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`${baseId}-panel-${index}`}
                  onClick={() => setOpen(expanded ? null : index)}
                  className="group flex w-full cursor-pointer flex-col items-start gap-3 text-left"
                  style={{
                    animation: 'fade-up 500ms ease both',
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <span
                    className={cx(
                      'relative z-10 flex size-11 items-center justify-center rounded-full border bg-surface text-signal transition-colors',
                      expanded ? 'border-signal' : 'border-rule-strong group-hover:border-signal',
                    )}
                  >
                    {stage.icon}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-mono text-11 text-muted">{sectionNumber(index)}</span>
                    <span className="text-15 font-semibold text-ink">{stage.label}</span>
                  </span>
                </button>
                <div
                  id={`${baseId}-panel-${index}`}
                  className={cx(
                    'grid overflow-hidden text-pretty transition-[grid-template-rows] duration-300 ease-out',
                    expanded ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="flex min-h-0 flex-col gap-1 pr-4">
                    <span className="font-mono text-12 text-signal">{stage.tech}</span>
                    <p className="m-0 text-13 leading-[1.5] text-body">{stage.desc}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
