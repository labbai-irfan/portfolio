import type { TechMark } from '@/lib/tech-marks';

/** A monochrome technology mark, drawn in the current text colour. Decorative: the name is text. */
export function TechMarkIcon({ mark, className }: { mark: TechMark; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={mark.path} />
    </svg>
  );
}
