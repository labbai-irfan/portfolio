import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';

/**
 * Put on the one link that should make the whole tile clickable (the stretched-link pattern).
 * The link's own outline is hidden; the tile shows the focus ring instead, following its corners.
 */
export const TILE_LINK =
  "after:absolute after:inset-0 after:rounded-tile after:content-[''] focus-visible:outline-none";

type TileProps = {
  as?: 'section' | 'article' | 'div';
  /** `dark` for the terminal and contact tiles; dark in both themes. */
  tone?: 'surface' | 'dark';
  /** Lifts on hover and keyboard focus. Use when the tile, or a link inside it, is clickable. */
  interactive?: boolean;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

/** A bento tile: a raised surface with the site's tile radius and two-layer shadow. */
export function Tile({
  as: Tag = 'div',
  tone = 'surface',
  interactive = false,
  labelledBy,
  className,
  children,
}: TileProps) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      className={cx(
        'relative min-w-0 tile',
        tone === 'dark' && 'border-term-border bg-bar text-on-bar',
        interactive &&
          'tile-interactive has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-signal',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
