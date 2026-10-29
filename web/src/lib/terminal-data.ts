import { getBuildInfo } from '@/lib/build-info';
import { dateRange } from '@/lib/format';
import { SKILL_TIER_ORDER, SKILL_TIERS, STATUS_WORDS } from '@/lib/labels';
import type { TerminalData } from '@/components/terminal/commands';
import type {
  INFRA_QUERY_RESULT,
  MILESTONES_QUERY_RESULT,
  PROJECTS_QUERY_RESULT,
  ROLES_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
  SKILLS_QUERY_RESULT,
} from '@/sanity/types';

type Sources = {
  settings: SETTINGS_QUERY_RESULT;
  projects: PROJECTS_QUERY_RESULT;
  skills: SKILLS_QUERY_RESULT;
  roles: ROLES_QUERY_RESULT;
  milestones: MILESTONES_QUERY_RESULT;
  infra: INFRA_QUERY_RESULT;
};

/** Everything the terminal may print, as plain data. Fetch the sources with `stega: false`. */
export function buildTerminalData({
  settings,
  projects,
  skills,
  roles,
  milestones,
  infra,
}: Sources): TerminalData {
  const build = getBuildInfo();

  const skillTiers = SKILL_TIER_ORDER.map((tier) => ({
    label: SKILL_TIERS[tier] ?? tier,
    names: skills.filter((s) => s.tier === tier).map((s) => s.name),
  })).filter((tier) => tier.names.length > 0);

  const byYear = new Map<string, string[]>();
  for (const m of milestones) {
    if (m.planned || !m.sortDate) continue;
    const year = m.sortDate.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), m.title]);
  }

  return {
    name: settings?.name ?? null,
    headlineLabel: settings?.headlineLabel ?? null,
    location: settings?.location ?? null,
    openToRoles: Boolean(settings?.openToRoles),
    email: settings?.email ?? null,
    linkedinUrl: settings?.linkedinUrl ?? null,
    githubUrl: settings?.githubUrl ?? null,
    projects: projects.map((p) => ({
      code: p.code,
      title: p.title,
      slug: p.slug,
      status: p.status,
      statusLabel: STATUS_WORDS[p.status] ?? p.status,
    })),
    skillTiers,
    roles: roles
      .filter((r) => r.kind !== 'education' && r.startDate)
      .map((r) => ({
        title: r.title,
        organisation: r.organisation,
        dates: dateRange(r.startDate ?? '', r.endDate, { yearsOnly: r.yearsOnly, ongoing: 'now' }),
      })),
    years: [...byYear.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([year, titles]) => ({ year, titles })),
    infra: infra.map((n) => ({ kicker: n.kicker, name: n.name, planned: n.state === 'planned' })),
    commit: build.shortSha,
    built: build.builtLabel,
  };
}
