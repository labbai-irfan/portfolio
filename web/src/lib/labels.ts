// Display labels for the enum-like values stored in Sanity (the option lists live in
// studio/schemaTypes/constants.ts). These are UI chrome: the stored value is the data.

export const STAGES = [
  { key: 'commit', short: 'CM', abbr: 'CMT', label: 'Commit' },
  { key: 'build', short: 'BD', abbr: 'BLD', label: 'Build' },
  { key: 'test', short: 'TS', abbr: 'TST', label: 'Test' },
  { key: 'ship', short: 'SH', abbr: 'SHP', label: 'Ship' },
  { key: 'run', short: 'RN', abbr: 'RUN', label: 'Run' },
  { key: 'observe', short: 'OB', abbr: 'OBS', label: 'Observe' },
] as const;

export const SKILL_GROUPS: Record<string, string> = {
  application: 'Application',
  data: 'Data',
  systems: 'Systems & automation',
  containers: 'Containers',
  delivery: 'Delivery & cloud',
};
export const SKILL_GROUP_ORDER = ['application', 'data', 'systems', 'containers', 'delivery'];

export const SKILL_TIERS: Record<string, string> = {
  work: 'At work',
  projects: 'In projects',
  learning: 'Learning',
};
export const SKILL_TIER_ORDER = ['work', 'projects', 'learning'];

export const MILESTONE_CATEGORIES: Record<string, string> = {
  career: 'Career',
  education: 'Education',
  project: 'Project',
  learning: 'Learning',
  site: 'Site',
};

/** Detail-link wording per project page layout. */
export const PROJECT_LINK_LABEL: Record<string, string> = {
  caseStudy: 'Read the case study →',
  pipeline: 'See the pipeline →',
  lab: 'Read the lab write-up →',
};

/** Project status as lower-case words (terminal output, search results). */
export const STATUS_WORDS: Record<string, string> = {
  live: 'live',
  inDevelopment: 'in development',
  shipsWithSite: 'ships with site',
  learningLab: 'learning lab',
  planned: 'planned',
};
