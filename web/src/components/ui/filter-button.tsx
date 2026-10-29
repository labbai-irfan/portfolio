import type { ComponentProps } from 'react';
import { cx } from '@/lib/utils';

type FilterButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  label: string;
  count?: number;
  pressed: boolean;
};

/** Toggle filter. State is exposed with aria-pressed; the parent owns it. */
export function FilterButton({ label, count, pressed, className, ...rest }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      {...rest}
      className={cx(
        'inline-flex min-h-11 cursor-pointer items-center gap-1.5 border border-rule-strong px-4 font-mono text-13',
        pressed ? 'bg-contrast text-on-contrast' : 'bg-surface text-ink hover:bg-ground',
        className,
      )}
    >
      {label}
      {count !== undefined && <span className="opacity-70">{count}</span>}
    </button>
  );
}
