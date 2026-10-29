/** Join class names, skipping falsy values. */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** True for links that leave the site. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
