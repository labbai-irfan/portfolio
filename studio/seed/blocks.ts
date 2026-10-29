// Tiny Portable Text builders for seed content. `_key`s are added by seed.ts.

type Span = { _type: 'span'; text: string; marks: string[] };
export type Block = {
  _type: 'block';
  style: string;
  markDefs: never[];
  children: Span[];
  listItem?: 'bullet' | 'number';
  level?: number;
};

const block = (text: string, style = 'normal'): Block => ({
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _type: 'span', text, marks: [] }],
});

export const p = (text: string) => block(text);
export const h3 = (text: string) => block(text, 'h3');
export const bullets = (...items: string[]): Block[] =>
  items.map((text) => ({ ...block(text), listItem: 'bullet', level: 1 }));
export const code = (filename: string, language: string, source: string) => ({
  _type: 'codeBlock',
  filename,
  language,
  code: source.trim(),
});
export const callout = (label: string, text: string, tone: 'note' | 'warning' = 'note') => ({
  _type: 'callout',
  tone,
  label,
  text,
});
export const section = (heading: string, navLabel: string, body: unknown[]) => ({
  _type: 'projectSection',
  heading,
  navLabel,
  body,
});
