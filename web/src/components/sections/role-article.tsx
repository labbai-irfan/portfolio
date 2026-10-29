import { MonoLabel } from '@/components/ui/mono-label';
import { dateRange } from '@/lib/format';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { ROLES_QUERY_RESULT } from '@/sanity/types';

export type Role = Fetched<ROLES_QUERY_RESULT[number]>;

/** A job or internship on the Experience page. Blocks without content are not rendered. */
export function RoleArticle({ role }: { role: Role }) {
  const kind = stegaClean(role.kind);
  const current = !role.endDate && kind === 'employment';
  const hasBody = Boolean(role.context || role.highlights?.length || role.alsoInRole);
  const hasAside = Boolean(role.stack?.length || role.infrastructureNote);

  return (
    <article className="border border-rule-strong bg-surface">
      <div
        className={cx(
          'flex flex-wrap items-start justify-between gap-4 px-6 py-8 lg:px-10 lg:py-9',
          (hasBody || hasAside) &&
            (current ? 'border-b border-rule-strong' : 'border-b border-rule'),
        )}
      >
        <div className="flex flex-col gap-2">
          <span
            className={cx(
              'font-mono text-12 tracking-data uppercase',
              current ? 'text-signal' : 'text-muted',
            )}
          >
            {dateRange(role.startDate ?? '', role.endDate, { yearsOnly: role.yearsOnly })}
            {role.location && ` · ${role.location}`}
          </span>
          <h2
            className={cx(
              'm-0 font-semibold',
              current
                ? 'text-34 leading-[1.05] tracking-heading lg:text-40'
                : 'text-28 leading-[1.1] tracking-lead lg:text-32',
            )}
          >
            {role.title}
          </h2>
          <p className={cx('m-0 text-body', current ? 'text-18' : 'text-17')}>
            {role.organisation}
          </p>
        </div>
        {current && (
          <span className="bg-progress-bg px-3 py-1.5 font-mono text-11 font-semibold tracking-chip text-progress uppercase">
            Current role
          </span>
        )}
        {kind === 'internship' && (
          <span className="border border-rule-dashed px-3 py-1.25 font-mono text-11 font-semibold tracking-chip text-body uppercase">
            Internship
          </span>
        )}
      </div>

      {(hasBody || hasAside) && (
        <div className="flex flex-wrap">
          {hasBody && (
            <div className="flex min-w-0 flex-[1.5_1_320px] flex-col gap-7 border-rule px-6 py-8 lg:flex-[1.5_1_520px] lg:px-10 lg:py-9 lg:not-last:border-r">
              {role.context && (
                <div className="flex flex-col gap-2.5">
                  <MonoLabel>Context</MonoLabel>
                  <p className="m-0 text-16 leading-[1.65] text-body">{role.context}</p>
                </div>
              )}
              {role.highlights && role.highlights.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <MonoLabel>{current ? 'What I built' : 'What I worked on'}</MonoLabel>
                  <ul className="m-0 flex list-none flex-col border-t border-rule p-0">
                    {role.highlights.map((item, index) => (
                      <li
                        key={item}
                        className="flex gap-4 border-b border-rule py-3.5 text-16 leading-[1.55]"
                      >
                        <span className="pt-0.75 font-mono text-12 text-signal">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {role.alsoInRole && (
                <div className="flex flex-col gap-2.5">
                  <MonoLabel>Also in the role</MonoLabel>
                  <p className="m-0 text-15 leading-[1.6] text-body">{role.alsoInRole}</p>
                </div>
              )}
            </div>
          )}
          {hasAside && (
            <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-7 bg-ground px-6 py-8 lg:px-10 lg:py-9">
              {role.stack && role.stack.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <MonoLabel>Stack</MonoLabel>
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {role.stack.map((tool) => (
                      <li
                        key={tool}
                        className="border border-rule-strong bg-surface px-2.5 py-1.75 font-mono text-12"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {role.infrastructureNote && (
                <div className="flex flex-col gap-2.5 border border-signal bg-surface p-5">
                  <h3 className="m-0 font-mono text-11 tracking-label text-progress uppercase">
                    Where this meets infrastructure
                  </h3>
                  <p className="m-0 text-15 leading-[1.6] text-ink">{role.infrastructureNote}</p>
                </div>
              )}
            </aside>
          )}
        </div>
      )}
    </article>
  );
}
