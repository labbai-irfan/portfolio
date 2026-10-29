// The hourly uptime probe (see .github/workflows/uptime.yml). Requests the live site, then writes
// the result to the `siteStatus` document in Sanity. The site reads that document live, so no
// commit and no redeploy is involved.
//
// Uptime is the share of successful probes over the last 7 days, taken from this workflow's own run
// history on GitHub (a run fails when the site is down). It is only reported once there are at
// least MIN_SAMPLES results, so one lucky check can never read as "100%".
import { pathToFileURL } from 'node:url';

export const WINDOW_DAYS = 7;
export const MIN_SAMPLES = 24;

/** Percentage of `true` results, one decimal, or null while there are too few samples. */
export function computeUptime(results, minSamples = MIN_SAMPLES) {
  if (results.length < minSamples) return null;
  const up = results.filter(Boolean).length;
  return Math.round((up / results.length) * 1000) / 10;
}

/** One request, 15 s timeout, one retry. `up` = any 2xx/3xx answer. */
export async function probe(url, fetchImpl = fetch) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetchImpl(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'user-agent': 'portfolio-uptime-probe' },
      });
      if (res.ok) return true;
    } catch {
      // Network error or timeout: retry once, then count as down.
    }
  }
  return false;
}

/** Results (true = success) of this workflow's completed runs in the window, oldest first. */
async function pastResults({ repo, token }) {
  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000).toISOString().slice(0, 10);
  const results = [];
  for (let page = 1; page <= 4; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/uptime.yml/runs?status=completed&per_page=100&page=${page}&created=>=${since}`,
      { headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const { workflow_runs: runs } = await res.json();
    for (const run of runs) {
      if (run.conclusion === 'success') results.push(true);
      else if (run.conclusion === 'failure') results.push(false);
    }
    if (runs.length < 100) break;
  }
  return results;
}

async function writeStatus({ projectId, dataset, token, doc }) {
  const res = await fetch(`https://${projectId}.api.sanity.io/v2026-10-01/data/mutate/${dataset}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
  });
  if (!res.ok) throw new Error(`Sanity mutate ${res.status}: ${await res.text()}`);
}

async function main() {
  const env = (name) => {
    const value = process.env[name];
    if (!value) throw new Error(`Missing ${name}`);
    return value;
  };
  const siteUrl = env('SITE_URL');
  const up = await probe(siteUrl);

  // This run is still "in progress" to GitHub, so add its own result to the history.
  const history = await pastResults({ repo: env('GITHUB_REPOSITORY'), token: env('GITHUB_TOKEN') });
  const uptime = computeUptime([...history, up]);

  await writeStatus({
    projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: env('SANITY_WRITE_TOKEN'),
    doc: {
      _id: 'siteStatus',
      _type: 'siteStatus',
      status: up ? 'up' : 'down',
      checkedAt: new Date().toISOString(),
      ...(uptime !== null && { uptime }),
    },
  });

  console.log(`${siteUrl} is ${up ? 'up' : 'DOWN'}; uptime ${uptime ?? 'not enough samples yet'}`);
  // A down site fails the run, which is what the uptime figure is computed from.
  process.exit(up ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
