// Option lists shared by schema types and structure.ts.
// Status values match the web StatusChip keys.

export const PROJECT_STATUSES = [
  { title: 'Live', value: 'live' },
  { title: 'In development', value: 'inDevelopment' },
  { title: 'Ships with site', value: 'shipsWithSite' },
  { title: 'Learning lab', value: 'learningLab' },
  { title: 'Planned', value: 'planned' },
];

export const PROJECT_LAYOUTS = [
  { title: 'Case study', value: 'caseStudy' },
  { title: 'Pipeline', value: 'pipeline' },
  { title: 'Lab', value: 'lab' },
];

export const STAGES = ['commit', 'build', 'test', 'ship', 'run', 'observe'] as const;

export const COVERAGE_STATES = [
  { title: 'None', value: 'none' },
  { title: 'Implemented', value: 'implemented' },
  { title: 'Lab', value: 'lab' },
  { title: 'Planned', value: 'planned' },
];

export const MILESTONE_CATEGORIES = [
  { title: 'Career', value: 'career' },
  { title: 'Education', value: 'education' },
  { title: 'Project', value: 'project' },
  { title: 'Learning', value: 'learning' },
  { title: 'Site', value: 'site' },
];

export const ROLE_KINDS = [
  { title: 'Employment', value: 'employment' },
  { title: 'Internship', value: 'internship' },
  { title: 'Education', value: 'education' },
];

export const SKILL_GROUPS = [
  { title: 'Application', value: 'application' },
  { title: 'Data', value: 'data' },
  { title: 'Systems & automation', value: 'systems' },
  { title: 'Containers', value: 'containers' },
  { title: 'Delivery & cloud', value: 'delivery' },
];

export const SKILL_TIERS = [
  { title: 'At work', value: 'work' },
  { title: 'In projects', value: 'projects' },
  { title: 'Learning', value: 'learning' },
];

export const INFRA_CATEGORIES = [
  { title: 'People', value: 'user' },
  { title: 'Build', value: 'build' },
  { title: 'Hosting', value: 'host' },
  { title: 'Planned', value: 'plan' },
];

export const CONNECTION_TYPES = [
  { title: 'Build-time', value: 'build' },
  { title: 'Request-time', value: 'request' },
  { title: 'Config', value: 'config' },
  { title: 'Planned', value: 'planned' },
];

export const HOME_SECTIONS = [
  { title: 'Work', value: 'work' },
  { title: 'Terminal', value: 'terminal' },
  { title: 'Infrastructure', value: 'infrastructure' },
  { title: 'Journey', value: 'journey' },
  { title: 'Blog / How I debug', value: 'notes' },
  { title: 'Contact', value: 'contact' },
];

/** Pages with an editable heading + intro, in the order shown in Page copy. */
export const COPY_PAGES = [
  { title: 'Work', value: 'work' },
  { title: 'Blog / Notes', value: 'notes' },
  { title: 'Journey', value: 'journey' },
  { title: 'Experience', value: 'experience' },
  { title: 'Skills', value: 'skills' },
  { title: 'Infrastructure', value: 'infrastructure' },
  { title: 'Contact', value: 'contact' },
  { title: 'Terminal', value: 'terminal' },
  { title: 'Résumé', value: 'resume' },
  { title: 'Not found (404)', value: 'notFound' },
];
