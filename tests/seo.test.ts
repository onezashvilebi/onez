import { describe, expect, it } from "vitest";
import { FOREIGN } from "~/content/pages/build-in-georgia";
import { CENA_PRICES } from "~/content/pages/misc";
import { seo } from "~/lib/meta";
import { modifiedFor } from "~/logic/modified";
import { MONOLITH, SERVICES } from "~/content/services";

const graph = (path: string, opts = {}) => {
  const tags = seo({ location: { pathname: path }, matches: [] }, "Заголовок", "Описание", opts);
  const ld = tags.find((t) => "script:ld+json" in (t as object)) as { "script:ld+json": { "@graph": Record<string, unknown>[] } };
  return ld["script:ld+json"]["@graph"];
};
const price = (s: string) => Number(s.replace(/[^\d]/g, ""));

// Свод v3, правило 40: цена в тексте, таблице, JSON-LD и llms.txt — из одного места.
describe("цены — один источник", () => {
  it("англоязычная посадочная повторяет те же три цены, что /cena", () => {
    expect(FOREIGN.en.prices.ranges.slice(0, 3).map(([, p]) => price(p))).toEqual(CENA_PRICES.map(([, p]) => price(p)));
  });

  it("Offer в разметке равен видимой цене «от»", () => {
    const service = graph("/ru/cena", { offers: CENA_PRICES }).find((n) => n["@type"] === "Service") as
      | { offers: { priceSpecification: { minPrice: number } }[] }
      | undefined;
    expect(service?.offers.map((o) => o.priceSpecification.minPrice)).toEqual(CENA_PRICES.map(([, p]) => price(p)));
  });
});

// Правила 22 и 24: дата правки и speakable на коммерческих страницах.
describe("разметка страницы", () => {
  it("у каждой услуги есть дата правки текста", () => {
    for (const s of [...SERVICES, ...MONOLITH]) expect(modifiedFor(s.slug)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("коммерческие страницы отдают dateModified и speakable", () => {
    for (const slug of ["", "uslugi", "cena", "process", "proverka-uchastka", "chastnye-doma"]) {
      const page = graph(`/ru/${slug}`).find((n) => n["@type"] === "WebPage") as { dateModified?: string; speakable: { cssSelector: string[] } };
      expect(page.dateModified).toBe(modifiedFor(slug));
      expect(page.speakable.cssSelector).toContain(".bluf");
    }
  });

  it("видимый FAQ добавляет свой селектор в speakable и блок FAQPage", () => {
    const g = graph("/ru/cena", { faq: [["Вопрос?", "Ответ."]] });
    const page = g.find((n) => n["@type"] === "WebPage") as { speakable: { cssSelector: string[] } };
    expect(page.speakable.cssSelector).toContain(".faq-answer");
    expect(g.some((n) => n["@type"] === "FAQPage")).toBe(true);
  });
});
