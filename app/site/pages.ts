// Карта сайта: из неё строятся маршруты (app/routes.ts), список пререндера
// (react-router.config.ts), sitemap.xml и ссылки. Импорты только относительные:
// файл читает конфиг сборки, где алиаса «~» нет.
import { ARTICLES } from "../content/articles-meta";
import { PROJECTS } from "../content/projects";
import { LANDING_SLUGS } from "../content/pages/landings/slugs";
import { MONOLITH, SERVICES } from "../content/services";

export const LANGS = ["ka", "ru", "en"] as const;
export type Lang = (typeof LANGS)[number];
/** Грузинский — основной язык, живёт в корне. */
export const PREFIX: Record<Lang, string> = { ka: "", ru: "/ru", en: "/en" };

/** `noindex` — страница собирается, но закрыта от индекса и не попадает в sitemap. */
export type PageDef = { slug: string; file: string; only?: Lang; noindex?: boolean };

export const PAGES: PageDef[] = [
  { slug: "", file: "routes/home.tsx" },
  { slug: "uslugi", file: "routes/uslugi.tsx" },
  ...LANDING_SLUGS.map((slug) => ({ slug, file: "routes/landing.tsx" })),
  ...[...SERVICES, ...MONOLITH].map((s) => ({ slug: s.slug, file: "routes/service.tsx" })),
  { slug: "proverka-uchastka", file: "routes/proverka-uchastka.tsx" },
  { slug: "process", file: "routes/process.tsx" },
  { slug: "cena", file: "routes/cena.tsx" },
  { slug: "obekty", file: "routes/obekty.tsx" },
  // Объекты — концепт-визуализации без реальных фото (≈30 уникальных слов): вне индекса до кейсов с фото (ONEZ-52, ONEZ-04).
  ...PROJECTS.map((p) => ({ slug: p.slug, file: "routes/object.tsx", noindex: true })),
  { slug: "o-kompanii", file: "routes/o-kompanii.tsx" },
  { slug: "komanda", file: "routes/komanda.tsx" },
  { slug: "kontakty", file: "routes/kontakty.tsx" },
  { slug: "stati", file: "routes/stati.tsx" },
  ...ARTICLES.map((a) => ({ slug: a.slug, file: "routes/article.tsx" })),
  { slug: "politika", file: "routes/politika.tsx" },
  // Лендинг для иностранных инвесторов пишется сразу по-английски (закон 3).
  { slug: "build-in-georgia", file: "routes/build-in-georgia.tsx" },
];

export const pageOf = (slug: string) => PAGES.find((p) => p.slug === slug);

export function langFromPath(pathname: string): Lang {
  const m = pathname.match(/^\/(ru|en)(?:\/|$)/);
  return (m?.[1] as Lang | undefined) ?? "ka";
}

export function slugFromPath(pathname: string): string {
  return pathname.replace(/^\/(?:ru|en)(?=\/|$)/, "").replace(/^\/+|\/+$/g, "");
}

/** Путь страницы на языке: pathFor("ru", "kontakty#form") → "/ru/kontakty#form". */
export function pathFor(lang: Lang, slug: string): string {
  const [page, hash] = slug.split("#");
  const target = pageOf(page ?? "")?.only ?? lang;
  const path = PREFIX[target] + (page ? `/${page}` : "") || "/";
  return hash ? `${path}#${hash}` : path;
}

/** Та же страница на другом языке; у одноязычной страницы — главная этого языка. */
export function switchPath(lang: Lang, slug: string): string {
  const only = pageOf(slug)?.only;
  return pathFor(lang, only && only !== lang ? "" : slug);
}

export function allPaths(): string[] {
  return LANGS.flatMap((lang) => PAGES.filter((p) => !p.only || p.only === lang).map((p) => pathFor(lang, p.slug)));
}
