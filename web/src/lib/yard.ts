/** A skill reduced to what the container yard needs to place it. `tier` is already stega-cleaned. */
export type YardEntry<T> = { item: T; tier: string; hasUsage: boolean };

export type YardPlan<T> = {
  /** Stack rows, top to bottom: Learning on top, then In projects, At work as the ground row. */
  rows: { tier: string; items: T[] }[];
  /** Learning skills with no usage note and nothing linked: listed as text, not drawn. */
  alsoLearning: T[];
  /** Roadmap skills for the Exploring dock. */
  exploring: T[];
};

const STACK = ['learning', 'projects', 'work'];

/**
 * Only skills with evidence become containers. Work and project skills always have it by
 * definition; a learning skill needs a usage note or something it is used in.
 */
export function planYard<T>(entries: YardEntry<T>[]): YardPlan<T> {
  const drawn = (entry: YardEntry<T>) =>
    entry.tier === 'work' ||
    entry.tier === 'projects' ||
    (entry.tier === 'learning' && entry.hasUsage);

  return {
    rows: STACK.map((tier) => ({
      tier,
      items: entries.filter((e) => e.tier === tier && drawn(e)).map((e) => e.item),
    })).filter((row) => row.items.length > 0),
    alsoLearning: entries.filter((e) => e.tier === 'learning' && !e.hasUsage).map((e) => e.item),
    exploring: entries.filter((e) => e.tier === 'exploring').map((e) => e.item),
  };
}
