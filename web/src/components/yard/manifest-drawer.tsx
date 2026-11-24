'use client';

import Link from 'next/link';
import type { ReactNode, RefObject } from 'react';
import { SKILL_GROUPS, SKILL_TIERS } from '@/lib/labels';
import { type Fetched, stegaClean } from '@/lib/stega';
import { usedInLink } from '@/lib/used-in';
import type { SKILLS_QUERY_RESULT } from '@/sanity/types';

type Skill = Fetched<SKILLS_QUERY_RESULT[number]>;

const containerName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const str = (value: ReactNode) => (
  <>
    <span className="text-term-hint">&quot;</span>
    {value}
    <span className="text-term-hint">&quot;</span>
  </>
);

/**
 * A skill's manifest, laid out like `docker inspect` output: tier, group, how it was used and
 * where. Only fields with a value are listed. A native <dialog>, so Escape, the focus trap and
 * focus restoration come from the browser.
 */
export function ManifestDrawer({
  skill,
  dialogRef,
}: {
  skill: Skill | null;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const tier = skill ? stegaClean(skill.tier) : '';
  const group = skill ? stegaClean(skill.group) : '';
  const links = (skill?.usedIn ?? []).map(usedInLink).filter((link) => link !== null);

  const fields: { key: string; value: ReactNode }[] = skill
    ? [
        { key: 'Name', value: str(skill.name) },
        { key: 'Tier', value: str(SKILL_TIERS[tier] ?? tier) },
        { key: 'Group', value: str(SKILL_GROUPS[group] ?? group) },
        ...(skill.usageNote ? [{ key: 'Usage', value: str(skill.usageNote) }] : []),
      ]
    : [];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="manifest-title"
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-xl border-0 border-l border-term-border bg-term p-0 text-term-out transition-[translate,display,overlay] transition-discrete duration-300 ease-out backdrop:bg-ink/60 motion-reduce:transition-none starting:open:translate-x-full"
    >
      {skill && (
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-term-rule bg-term-deep px-5 py-3">
            <h2 id="manifest-title" className="m-0 font-mono text-13 font-normal">
              <span className="text-term-prompt">$</span> docker inspect{' '}
              {containerName(stegaClean(skill.name))}
            </h2>
            <button
              type="button"
              aria-label="Close manifest"
              onClick={() => dialogRef.current?.close()}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center border border-term-control text-term-out"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 4l10 10M14 4 4 14" />
              </svg>
            </button>
          </header>
          <pre className="m-0 flex-1 overflow-auto px-5 py-5 font-mono text-13 leading-relaxed whitespace-pre-wrap">
            <span className="text-term-hint">{'[\n  {\n'}</span>
            {fields.map((field, i) => (
              <span key={field.key}>
                {'    '}
                <span className="text-term-label">&quot;{field.key}&quot;</span>
                <span className="text-term-hint">: </span>
                {field.value}
                {i < fields.length - 1 || links.length > 0 ? ',' : ''}
                {'\n'}
              </span>
            ))}
            {links.length > 0 && (
              <>
                {'    '}
                <span className="text-term-label">&quot;UsedIn&quot;</span>
                <span className="text-term-hint">{': [\n'}</span>
                {links.map((link, i) => (
                  <span key={`${link.href}-${i}`}>
                    {'      '}
                    {str(
                      <Link
                        href={link.href}
                        onClick={() => dialogRef.current?.close()}
                        className="text-term-prompt underline underline-offset-3"
                      >
                        {link.label}
                      </Link>,
                    )}
                    {i < links.length - 1 ? ',' : ''}
                    {'\n'}
                  </span>
                ))}
                <span className="text-term-hint">{'    ]\n'}</span>
              </>
            )}
            <span className="text-term-hint">{'  }\n]'}</span>
          </pre>
        </div>
      )}
    </dialog>
  );
}
