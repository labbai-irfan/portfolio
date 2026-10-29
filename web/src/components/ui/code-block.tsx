import { cx } from '@/lib/utils';
import { CopyButton } from './copy-button';

type CodeBlockProps = { code: string; filename?: string | null; className?: string };

export function CodeBlock({ code, filename, className }: CodeBlockProps) {
  return (
    <div className={cx('border border-term-border bg-term', className)}>
      <div className="flex items-center justify-between gap-4 border-b border-term-rule py-1.5 pr-1.5 pl-5">
        <span className="truncate font-mono text-12 text-term-hint">{filename}</span>
        <CopyButton text={code} />
      </div>
      <pre
        tabIndex={0}
        aria-label={filename ?? 'Code'}
        className="m-0 overflow-x-auto px-5 py-6 font-mono text-14 leading-[1.75] whitespace-pre-wrap text-term-out"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
