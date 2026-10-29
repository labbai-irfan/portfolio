import Image from 'next/image';
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from '@portabletext/react';
import { CodeBlock } from '@/components/ui/code-block';
import { Figure } from '@/components/ui/figure';
import { isExternal } from '@/lib/utils';
import { cx } from '@/lib/utils';

type CodeBlockValue = { code?: string | null; filename?: string | null };
type FigureValue = {
  label?: string | null;
  textEquivalent?: string | null;
  image?: {
    asset?: {
      url?: string | null;
      metadata?: { dimensions?: { width: number; height: number } | null } | null;
    } | null;
  } | null;
};
type CalloutValue = { tone?: string | null; label?: string | null; text?: string | null };
type LinkMark = { href?: string | null };

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="m-0 text-17 leading-[1.7] text-body">{children}</p>,
    h3: ({ children }) => (
      <h3 className="m-0 mt-2 text-22 font-semibold tracking-lead text-ink">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="m-0 border border-rule-strong bg-ground px-6 py-5 text-18 leading-[1.6] font-medium text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-17 leading-[1.6] text-body">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-17 leading-[1.6] text-body">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="border border-rule bg-ground px-1.5 py-0.5 font-mono text-14 text-ink">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = (value as LinkMark | undefined)?.href;
      if (!href) return <>{children}</>;
      const external = isExternal(href);
      return (
        <a href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
          {children}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    },
  },
  types: {
    codeBlock: ({ value }) => {
      const block = value as CodeBlockValue;
      return block.code ? <CodeBlock code={block.code} filename={block.filename} /> : null;
    },
    figure: ({ value }) => {
      const figure = value as FigureValue;
      const asset = figure.image?.asset;
      if (!asset?.url || !figure.textEquivalent) return null;
      const size = asset.metadata?.dimensions;
      return (
        <Figure label={figure.label ?? 'Figure'} caption={figure.textEquivalent}>
          {/* The caption IS the text equivalent, so the image itself carries no alt. */}
          <Image
            src={`${asset.url}?w=1200&auto=format`}
            alt=""
            width={size?.width ?? 1200}
            height={size?.height ?? 675}
            unoptimized
            className="mx-auto h-auto max-w-full"
          />
        </Figure>
      );
    },
    callout: ({ value }) => {
      const callout = value as CalloutValue;
      if (!callout.text) return null;
      const warning = callout.tone === 'warning';
      return (
        <aside
          className={cx(
            'flex flex-col gap-2 border p-5',
            warning ? 'border-lab bg-lab-bg' : 'border-signal bg-progress-bg',
          )}
        >
          {callout.label && (
            <span
              className={cx(
                'font-mono text-11 tracking-label uppercase',
                warning ? 'text-lab' : 'text-progress',
              )}
            >
              {callout.label}
            </span>
          )}
          <p className="m-0 text-16 leading-[1.6] text-ink">{callout.text}</p>
        </aside>
      );
    },
  },
};

/** Portable Text from Sanity: the schema's block styles, lists, marks and custom blocks. */
export function RichText({ value }: { value: PortableTextProps['value'] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <PortableText value={value} components={components} />
    </div>
  );
}
