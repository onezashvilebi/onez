import { slugFromPath } from "~/site/pages";

/** Крошка: [slug, подпись]; slug null — текущая страница. */
export type Crumb = [slug: string | null, label: string];

/**
 * Крошки от главной до текущей страницы:
 * crumbs("Контакты"), crumbs(["obekty", "Объекты"], name).
 */
export function crumbs(...trail: [...parents: [string, string][], current: string]): Crumb[] {
  const parents = trail.slice(0, -1) as [string, string][];
  const current = trail[trail.length - 1] as string;
  return [["", "Главная"], ...parents, [null, current]];
}

/** Запись контента для адреса страницы-шаблона; нет такой — 404. */
export function bySlugOr404<T extends { slug: string }>(items: readonly T[], pathname: string): T {
  const slug = slugFromPath(pathname);
  const hit = items.find((x) => x.slug === slug);
  if (!hit) throw new Response(null, { status: 404 });
  return hit;
}
