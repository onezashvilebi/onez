// Словари читаются только на сервере (в загрузчике раскладки языка), в
// клиентский бандл не попадают. ka.json/en.json генерирует `npm run i18n`
// из scripts/i18n-source/*.json; ручные дополнения — в extra.json.
import type { Lang } from "~/site/pages";
import type { Dict } from "./context";
import en from "./en.json";
import extra from "./extra.json";
import ka from "./ka.json";
import pages from "./pages.json";

/**
 * Словарь страницы: только те строки, которые на ней есть, плюс динамика
 * (`scripts/i18n-pages.mjs`). Словарь уезжает в HTML каждой страницы, и целиком
 * он весит 293 КБ — ka и en грузили втрое больше ru (ONEZ-54). Нет карты для
 * страницы (новый адрес, первая сборка) — отдаём полный словарь: лучше лишний
 * вес, чем непереведённая строка.
 */
export function dictFor(lang: Lang, slug?: string): Dict {
  if (lang === "ru") return {};
  const full: Dict = { ...(lang === "ka" ? ka : en), ...extra[lang] };
  // Без slug (llms.txt собирает строки всех страниц сразу) — словарь целиком:
  // у главной slug пустой, поэтому признак «сужать» — сам факт аргумента.
  if (slug === undefined) return full;
  const keys = (pages as Record<string, string[] | undefined>)[slug];
  if (!keys?.length) return full;
  const out: Dict = {};
  for (const k of keys) if (full[k] !== undefined) out[k] = full[k]!;
  return out;
}
