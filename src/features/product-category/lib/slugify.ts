const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

/** Lowercases, strips Vietnamese diacritics, and hyphenates — small local helper, no external dependency. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
