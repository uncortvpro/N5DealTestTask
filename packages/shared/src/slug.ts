/**
 * Pretty-URL helpers. The slug's text is purely decorative — the trailing
 * "-{id}" segment is the actual lookup key, so a slug never needs its own
 * DB column, uniqueness constraint, or migration; any text before the id
 * suffix is ignored on read.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function toSlugPath(title: string, id: number): string {
  const slug = slugify(title);
  return slug ? `${slug}-${id}` : String(id);
}

export function idFromSlugPath(slugPath: string): number | null {
  const match = slugPath.match(/(\d+)$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
}
