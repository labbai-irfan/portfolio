const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `2026-04-01` → `Apr 2026`. Parsed by hand: `new Date('2026-04-01')` shifts with the time zone. */
export function monthYear(iso: string): string {
  const [year, month] = iso.split('-');
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : (year ?? '');
}

/** A role's dates: `Apr 2026 — Present`, or years only (`2023 — 2026`) when the role says so. */
export function dateRange(
  start: string,
  end: string | null | undefined,
  options: { yearsOnly?: boolean | null; ongoing?: string } = {},
): string {
  const ongoing = options.ongoing ?? 'Present';
  const from = options.yearsOnly ? start.slice(0, 4) : monthYear(start);
  const to = end ? (options.yearsOnly ? end.slice(0, 4) : monthYear(end)) : ongoing;
  return `${from} — ${to}`;
}

/** Months between two ISO dates (an open end counts to today); at least 1. */
export function monthsBetween(start: string, end?: string | null): number {
  const a = new Date(start);
  const b = end ? new Date(end) : new Date();
  return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()));
}

/** `2026-07-20` → `20 Jul 2026`. */
export function fullDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const name = MONTHS[Number(month) - 1];
  return name ? `${Number(day)} ${name} ${year}` : iso;
}

/** Zero-padded position for numbered section bars: `0` → `01`. */
export function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/** `Irfan Noor Mohammed` → `Irfan N. M.`: the first name, then initials. For tight spaces. */
export function shortName(name: string): string {
  const [first, ...rest] = name.trim().split(/\s+/);
  return [first, ...rest.map((word) => `${word[0]?.toUpperCase()}.`)].filter(Boolean).join(' ');
}
