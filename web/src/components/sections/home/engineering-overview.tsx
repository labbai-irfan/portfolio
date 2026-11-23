import { SpecStrip } from '@/components/ui/spec-strip';
import { getBuildInfo } from '@/lib/build-info';
import type { Fetched } from '@/lib/stega';
import { stegaClean } from '@/lib/stega';
import type { SETTINGS_QUERY_RESULT } from '@/sanity/types';

type Status = { status: string | null; uptime: number | null } | null;
type SummaryCells = Fetched<NonNullable<SETTINGS_QUERY_RESULT>['summaryCells']>;

/** One horizontal facts strip — live status, the build stamp and the Studio's summary cells. */
export function EngineeringOverview({
  status,
  summaryCells,
  className,
}: {
  status: Status;
  summaryCells: SummaryCells;
  className?: string;
}) {
  const { shortSha, builtLabel } = getBuildInfo();
  const up = stegaClean(status?.status) === 'up';

  const items = [
    { label: 'Status', value: status?.status ? (up ? 'Up' : 'Down') : 'Not measured yet' },
    { label: 'Uptime', value: status?.uptime != null ? `${status.uptime}%` : null },
    { label: 'Built', value: builtLabel },
    { label: 'Commit', value: shortSha },
    ...(summaryCells ?? []).map((cell) => ({ label: cell.label, value: cell.value })),
  ];

  return <SpecStrip items={items} variant="stamp" className={className} />;
}
