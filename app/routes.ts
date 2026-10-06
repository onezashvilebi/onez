import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import { LANGS, PAGES, type Lang } from "./site/pages";

// Одна раскладка на язык (у каждой свой id), чтобы при смене языка словарь
// в загрузчике раскладки перезапрашивался.
const pages = (lang: Lang) =>
  PAGES.filter((p) => !p.only || p.only === lang).map((p) =>
    p.slug ? route(p.slug, p.file, { id: `${lang}:${p.slug}` }) : index(p.file, { id: `${lang}:home` }),
  );

export default [
  route("sitemap.xml", "routes/sitemap.ts"),
  route("llms.txt", "routes/llms.ts"),
  // Админка вне языковых раскладок: без шапки, подвала и словаря, только по-русски.
  route("admin", "routes/admin.tsx", { id: "admin" }),
  ...LANGS.filter((l) => l !== "ka").map((lang) => route(lang, "routes/locale.tsx", { id: `lang-${lang}` }, pages(lang))),
  layout("routes/locale.tsx", { id: "lang-ka" }, [...pages("ka"), route("*", "routes/not-found.tsx")]),
] satisfies RouteConfig;
