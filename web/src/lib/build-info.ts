// Build stamp for the footer and the hero pipeline panel. Values are inlined at build time
// by next.config.ts from CI/Vercel environment variables; anything missing is null and is
// not rendered.

export type BuildInfo = {
  commitSha: string | null;
  shortSha: string | null;
  builtAt: string | null;
  /** `29 Oct 2026, 06:27 UTC` — for display; `builtAt` stays the machine-readable ISO value. */
  builtLabel: string | null;
  runUrl: string | null;
};

const value = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function label(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

export function getBuildInfo(): BuildInfo {
  const commitSha = value(process.env.BUILD_COMMIT_SHA);
  return {
    commitSha,
    shortSha: commitSha ? commitSha.slice(0, 7) : null,
    builtAt: value(process.env.BUILD_TIME),
    builtLabel: label(value(process.env.BUILD_TIME)),
    runUrl: value(process.env.BUILD_RUN_URL),
  };
}
