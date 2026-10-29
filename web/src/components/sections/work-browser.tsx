'use client';

import { useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterButton } from '@/components/ui/filter-button';
import { ProjectCard, statusOf, type ProjectCardData } from './project-card';

const STATUS_FILTERS = [
  { id: 'inDevelopment', label: 'In development' },
  { id: 'shipsWithSite', label: 'Ships with site' },
  { id: 'learningLab', label: 'Learning lab' },
  { id: 'planned', label: 'Planned' },
  { id: 'live', label: 'Live' },
];

/** Status filters with counts over the project cards. Pressed state is announced; no URL state. */
export function WorkBrowser({ projects }: { projects: ProjectCardData[] }) {
  const [filter, setFilter] = useState('all');
  const count = (id: string) => projects.filter((p) => statusOf(p) === id).length;
  // "Live" has no card in the design; it appears only once a project is actually live.
  const filters = STATUS_FILTERS.filter((f) => f.id !== 'live' || count('live') > 0);
  const shown = filter === 'all' ? projects : projects.filter((p) => statusOf(p) === filter);

  return (
    <>
      {/* Continues the white hero band above it (the page renders the hero just before this). */}
      <div className="border-b border-rule-strong bg-surface">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-4 pb-7 lg:px-10">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
            <FilterButton
              label="All"
              count={projects.length}
              pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            {filters.map((f) => (
              <FilterButton
                key={f.id}
                label={f.label}
                count={count(f.id)}
                pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </div>
          <p role="status" className="m-0 font-mono text-12 text-muted">
            Showing {shown.length} of {projects.length}
          </p>
        </div>
      </div>

      <section aria-label="Projects" className="mx-auto max-w-page px-4 pt-12 pb-22 lg:px-10">
        {shown.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {shown.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState label="No results" title="No projects with this status yet." />
        )}
      </section>
    </>
  );
}
