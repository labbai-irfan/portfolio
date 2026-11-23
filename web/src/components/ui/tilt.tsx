'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '@/lib/utils';

/**
 * Tilts its child toward the pointer (the `tilt` utility in globals.css does the drawing). Only on
 * devices with a fine pointer and hover, and never when reduced motion is requested; everyone else
 * gets the flat tile. Writes CSS variables directly, so moving the mouse never re-renders React.
 */
export function Tilt({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  /** Largest rotation, in degrees, at the tile's edge. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const allowed = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!el || !allowed.matches) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        el.dataset.tilting = '';
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      delete el.dataset.tilting;
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [max]);

  return (
    <div ref={ref} className={cx('tilt', className)}>
      {children}
    </div>
  );
}
