import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'dark' | 'light' | 'onBar' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'min-h-13 bg-signal text-on-signal hover:bg-signal-hover hover:text-on-signal',
  secondary: 'min-h-13 border border-ink text-ink hover:bg-ground hover:text-ink',
  dark: 'min-h-11 bg-contrast text-on-contrast hover:text-on-contrast',
  // On a dark band (section bar, terminal, contact): white button, and the soft-blue CTA.
  light: 'min-h-12 bg-on-bar text-bar hover:text-bar',
  onBar: 'min-h-13 bg-term-prompt text-bar hover:text-bar',
  // Text-only action beside a filled button.
  ghost: 'min-h-13 px-3 text-ink hover:text-signal-hover',
};

type Common = { variant?: Variant; children: ReactNode; className?: string };
type AsLink = Common & { href: string } & Omit<
    ComponentProps<typeof Link>,
    'href' | 'className' | 'children'
  >;
type AsButton = Common & { href?: undefined } & Omit<
    ComponentProps<'button'>,
    'className' | 'children'
  >;

/** Renders a Next.js Link when given an href, otherwise a button. */
export function Button(props: AsLink | AsButton) {
  const classes = cx(
    'inline-flex cursor-pointer items-center justify-center gap-2 px-6 text-15 font-medium no-underline',
    variants[props.variant ?? 'primary'],
    props.className,
  );

  if (props.href !== undefined) {
    const { variant: _variant, className: _className, children, ...rest } = props;
    return (
      <Link {...rest} className={classes}>
        {children}
      </Link>
    );
  }
  const { variant: _variant, className: _className, children, type = 'button', ...rest } = props;
  return (
    <button {...rest} type={type} className={classes}>
      {children}
    </button>
  );
}
