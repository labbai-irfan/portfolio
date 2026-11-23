import type { ReactNode } from 'react';
import type { LivePerspective } from 'next-sanity/live';
import { buildTerminalData } from '@/lib/terminal-data';
import { cachedSanity, type DynamicFetchOptions } from '@/sanity/live';
import {
  INFRA_QUERY,
  MILESTONES_QUERY,
  PROJECTS_QUERY,
  ROLES_QUERY,
  SETTINGS_QUERY,
  SKILLS_QUERY,
} from '@/sanity/queries';
import { TerminalProvider } from './terminal-context';

/** Everything the terminal can print, from the same queries as the pages. Plain text: no stega. */
async function getTerminalData(perspective: LivePerspective) {
  'use cache';
  const stega = false;
  const [settings, projects, skills, roles, milestones, infra] = await Promise.all([
    cachedSanity({ query: SETTINGS_QUERY, perspective, stega }),
    cachedSanity({ query: PROJECTS_QUERY, perspective, stega }),
    cachedSanity({ query: SKILLS_QUERY, perspective, stega }),
    cachedSanity({ query: ROLES_QUERY, perspective, stega }),
    cachedSanity({ query: MILESTONES_QUERY, perspective, stega }),
    cachedSanity({ query: INFRA_QUERY, perspective, stega }),
  ]);
  return buildTerminalData({
    settings: settings.data,
    projects: projects.data,
    skills: skills.data,
    roles: roles.data,
    milestones: milestones.data,
    infra: infra.data,
  });
}

/**
 * Mounts the site-wide terminal (root layout only): loads its data once, then wraps the page so
 * the hero, the overlay and /terminal share one session.
 */
export async function TerminalHost({
  perspective,
  children,
}: Pick<DynamicFetchOptions, 'perspective'> & { children: ReactNode }) {
  const data = await getTerminalData(perspective);
  return <TerminalProvider data={data}>{children}</TerminalProvider>;
}
