import { modifiedFor } from "~/logic/modified";
import { SITE_URL } from "~/site/contacts";
import { LANGS, PAGES, pathFor } from "~/site/pages";

// Каждая страница на каждом языке + её языковые версии (hreflang) — так Google
// узнаёт /ru и /en, даже если ссылки на них ещё не нашёл. lastmod — дата правки
// текста из `logic/modified.ts` (та же, что видна на странице), не дата сборки.
export function loader() {
  const urls = PAGES.filter((p) => !p.noindex).flatMap((p) => {
    const langs = p.only ? [p.only] : LANGS;
    const alternates = p.only
      ? ""
      : [...LANGS.map((l) => [l, pathFor(l, p.slug)]), ["x-default", pathFor("ka", p.slug)]]
          .map(([l, path]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${path}"/>`)
          .join("");
    const modified = modifiedFor(p.slug);
    const lastmod = modified ? `<lastmod>${modified}</lastmod>` : "";
    return langs.map((l) => `<url><loc>${SITE_URL}${pathFor(l, p.slug)}</loc>${lastmod}${alternates}</url>`);
  }).join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
