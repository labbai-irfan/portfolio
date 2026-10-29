import { callout } from './blocks/callout';
import { codeBlock } from './blocks/code-block';
import { figure } from './blocks/figure';
import { credential } from './documents/credential';
import { infraNode } from './documents/infra-node';
import { milestone } from './documents/milestone';
import { note } from './documents/note';
import { noteCategory } from './documents/note-category';
import { project } from './documents/project';
import { role } from './documents/role';
import { skill } from './documents/skill';
import { altImage } from './objects/alt-image';
import { debugSteps } from './objects/debug-steps';
import { evidenceLink } from './objects/evidence-link';
import { homeSection } from './objects/home-section';
import { infraConnection } from './objects/infra-connection';
import { labelledValue } from './objects/labelled-value';
import { pageIntro } from './objects/page-intro';
import { projectSection } from './objects/project-section';
import { richText } from './objects/rich-text';
import { seo } from './objects/seo';
import { socialLink } from './objects/social-link';
import { stageCoverage } from './objects/stage-coverage';
import { homePage } from './singletons/home-page';
import { pageCopy } from './singletons/page-copy';
import { siteSettings } from './singletons/site-settings';
import { siteStatus } from './singletons/site-status';

export const SINGLETON_TYPES = ['siteSettings', 'pageCopy', 'homePage', 'siteStatus'];

export const schemaTypes = [
  // Singletons
  siteSettings,
  pageCopy,
  homePage,
  siteStatus,
  // Documents
  project,
  note,
  noteCategory,
  milestone,
  credential,
  role,
  skill,
  infraNode,
  // Objects
  altImage,
  evidenceLink,
  stageCoverage,
  seo,
  socialLink,
  labelledValue,
  pageIntro,
  homeSection,
  debugSteps,
  projectSection,
  richText,
  infraConnection,
  // Portable Text blocks
  codeBlock,
  figure,
  callout,
];
