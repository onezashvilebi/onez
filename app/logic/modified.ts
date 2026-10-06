import { ARTICLES } from "~/content/articles-meta";
import { PAGE_MODIFIED } from "~/content/pages/meta";
import { MONOLITH, SERVICES } from "~/content/services";

/**
 * Дата последней правки текста страницы (YYYY-MM-DD) — один источник для трёх
 * мест сразу (свод v3, правило 22): видимое «Обновлено» на странице,
 * `dateModified` в JSON-LD и `lastmod` в sitemap.xml. Дата берётся из данных
 * страницы, а не из даты сборки: пересборка без правки текста её не двигает.
 */
const MODIFIED = new Map<string, string>([
  ...ARTICLES.map((a) => [a.slug, a.modified] as const),
  ...[...SERVICES, ...MONOLITH].map((s) => [s.slug, s.modified] as const),
  ...Object.entries(PAGE_MODIFIED),
]);

export const modifiedFor = (slug: string): string | undefined => MODIFIED.get(slug);
