const VIETNAMESE_DIACRITICS: [RegExp, string][] = [
  [/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a"],
  [/[èéẹẻẽêềếệểễ]/g, "e"],
  [/[ìíịỉĩ]/g, "i"],
  [/[òóọỏõôồốộổỗơờớợởỡ]/g, "o"],
  [/[ùúụủũưừứựửữ]/g, "u"],
  [/[ỳýỵỷỹ]/g, "y"],
  [/đ/g, "d"],
];

/** Small local helper — no external dependency. Handles Vietnamese diacritics since every seed dataset in this app is Vietnamese business content. */
export function slugify(input: string): string {
  let value = input.toLowerCase();
  for (const [pattern, replacement] of VIETNAMESE_DIACRITICS) value = value.replace(pattern, replacement);
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
