import { describe, expect, it } from "vitest";
// @ts-expect-error — служебный скрипт сборки на JS, типов у него нет.
import { pageHits } from "../scripts/check-i18n.mjs";

const page = (body: string, ld?: object) =>
  `<html><head>${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ""}</head><body>${body}</body></html>`;

// Счётчик непереведённых строк — единственная защита закона 2 перед коммитом.
describe("поиск непереведённых строк", () => {
  it("молчит на переведённой странице", () => {
    expect(pageHits(page("<h1>Prices</h1>", { "@type": "FAQPage", mainEntity: [{ name: "How much?" }] }))).toEqual([]);
  });

  it("ловит кириллицу в тексте страницы", () => {
    expect(pageHits(page("<h1>Цена фиксирована</h1>"))).toHaveLength(1);
  });

  it("ловит кириллицу в JSON-LD, а не только в тексте (ONEZ-50)", () => {
    const hits = pageHits(page("<h1>Prices</h1>", { "@type": "FAQPage", mainEntity: [{ name: "Сколько стоит каркас?" }] }));
    expect(hits).toEqual(["JSON-LD: Сколько стоит каркас?"]);
  });

  it("не считает русские ключи словаря в данных гидрации", () => {
    expect(pageHits(`<html><body><h1>Prices</h1><script>window.__data={"Цена":"Prices"}</script></body></html>`)).toEqual([]);
  });

  it("сообщает о неразбираемой разметке", () => {
    expect(pageHits(`<html><head><script type="application/ld+json">{нет</script></head><body></body></html>`)).toEqual(["JSON-LD: разметка не разбирается"]);
  });
});
