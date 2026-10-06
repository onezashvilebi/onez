import { describe, expect, it } from "vitest";
import { ARTICLES, ARTICLE_SERVICE, SERVICE_ARTICLES } from "~/content/articles-meta";
import { MONOLITH, RELATED_SERVICES, SERVICES } from "~/content/services";
import { PAGES } from "~/site/pages";

// Перелинковка кластеров (docs/SEO.md, §4): услуга ↔ статьи и услуга ↔ /cena.
const services = [...SERVICES, ...MONOLITH].map((s) => s.slug);
const articles = ARTICLES.map((a) => a.slug);
const slugs = new Set(PAGES.map((p) => p.slug));

describe("кластеры услуг", () => {
  it("у каждой услуги 2–3 статьи, и все они существуют", () => {
    for (const s of services) {
      const list = SERVICE_ARTICLES[s] ?? [];
      expect(list.length, s).toBeGreaterThanOrEqual(2);
      expect(list.length, s).toBeLessThanOrEqual(3);
      for (const a of list) expect(articles, `${s} → ${a}`).toContain(a);
    }
  });

  it("связь двусторонняя: статья с услуги ссылается на эту услугу", () => {
    for (const s of services)
      for (const a of SERVICE_ARTICLES[s] ?? []) expect(ARTICLE_SERVICE[a]?.map(([to]) => to), `${a} → ${s}`).toContain(s);
  });

  it("статья ссылается только на услуги, которые ссылаются на неё, и на существующие адреса", () => {
    for (const [a, links] of Object.entries(ARTICLE_SERVICE))
      for (const [to] of links) {
        expect(slugs.has(to), `${a} → ${to}`).toBe(true);
        if (services.includes(to)) expect(SERVICE_ARTICLES[to], `${to} ← ${a}`).toContain(a);
      }
  });

  it("/cena ссылается на все услуги", () => {
    expect([...(RELATED_SERVICES.cena ?? [])].sort()).toEqual([...services].sort());
  });
});
