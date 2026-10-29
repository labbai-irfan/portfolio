import { cx } from '@/lib/utils';

export type ProjectStatus = 'live' | 'inDevelopment' | 'shipsWithSite' | 'learningLab' | 'planned';

const chips: Record<ProjectStatus, { label: string; className: string }> = {
  live: { label: 'Live', className: 'bg-live-bg py-1.25 text-live' },
  inDevelopment: { label: 'In development', className: 'bg-progress-bg py-1.25 text-progress' },
  shipsWithSite: { label: 'Ships with site', className: 'bg-progress-bg py-1.25 text-progress' },
  learningLab: { label: 'Learning lab', className: 'bg-lab-bg py-1.25 text-lab' },
  planned: {
    label: 'Planned',
    className: 'border border-dashed border-rule-dashed py-1 text-planned',
  },
};

export function StatusChip({ status, className }: { status: ProjectStatus; className?: string }) {
  const chip = chips[status];
  return (
    <span
      className={cx(
        'inline-block px-2.5 font-mono text-11 leading-none font-semibold tracking-chip uppercase',
        chip.className,
        className,
      )}
    >
      {chip.label}
    </span>
  );
}
