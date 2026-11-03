// Row packing for the home bento grid. Tiles arrive in the Studio's order, each with a preferred
// width in grid columns. A tile that does not fit in what is left of the current row starts a new
// row; the columns left over in a short row are shared out across that row's tiles, so every row
// ends flush, with no holes and no single tile stretched far past its neighbours.

export type BentoItem<T> = { item: T; span: number };

/** Assign each item a column span so that every row of `cols` columns is exactly full. */
export function packRows<T>(items: { item: T; prefer: number }[], cols: number): BentoItem<T>[] {
  const out: BentoItem<T>[] = [];
  let row: BentoItem<T>[] = [];
  let used = 0;

  const closeRow = () => {
    const spare = cols - used;
    if (row.length > 0 && spare > 0) {
      const each = Math.floor(spare / row.length);
      row.forEach((tile) => (tile.span += each));
      row[row.length - 1]!.span += spare - each * row.length;
    }
    row = [];
    used = 0;
  };

  for (const { item, prefer } of items) {
    const span = Math.min(Math.max(prefer, 1), cols);
    if (used + span > cols) closeRow();
    const tile = { item, span };
    out.push(tile);
    row.push(tile);
    used += span;
    if (used === cols) closeRow();
  }
  closeRow();
  return out;
}
