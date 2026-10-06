import { describe, expect, it } from "vitest";
import { LANGS, PAGES, allPaths, langFromPath, pathFor, slugFromPath, switchPath } from "~/site/pages";

// Карта страниц — единственный источник адресов (закон 2 и раздел site/ в CLAUDE.md).
describe("адреса страниц", () => {
  it("грузинский живёт в корне, русский и английский — под префиксом", () => {
    expect(pathFor("ka", "kontakty")).toBe("/kontakty");
    expect(pathFor("ru", "kontakty")).toBe("/ru/kontakty");
    expect(pathFor("en", "kontakty")).toBe("/en/kontakty");
    expect(pathFor("ka", "")).toBe("/");
    expect(pathFor("ru", "")).toBe("/ru");
  });

  it("якорь остаётся на конце адреса", () => {
    expect(pathFor("ru", "kontakty#form")).toBe("/ru/kontakty#form");
  });

  it("лендинг для нерезидентов существует на трёх языках", () => {
    expect(pathFor("ru", "build-in-georgia")).toBe("/ru/build-in-georgia");
    expect(switchPath("ru", "build-in-georgia")).toBe("/ru/build-in-georgia");
    expect(switchPath("ka", "build-in-georgia")).toBe("/build-in-georgia");
  });

  it("язык и slug читаются обратно из пути", () => {
    expect(langFromPath("/ru/kontakty")).toBe("ru");
    expect(langFromPath("/kontakty")).toBe("ka");
    expect(langFromPath("/render-farm")).toBe("ka");
    expect(slugFromPath("/en/kontakty/")).toBe("kontakty");
    expect(slugFromPath("/ru")).toBe("");
  });

  it("пути пересчитываются в себя же: путь → язык + slug → путь", () => {
    for (const lang of LANGS)
      for (const page of PAGES.filter((p) => !p.only || p.only === lang)) {
        const path = pathFor(lang, page.slug);
        expect(pathFor(langFromPath(path), slugFromPath(path))).toBe(path);
      }
  });

  it("в карте нет повторов slug и пустых файлов", () => {
    expect(new Set(PAGES.map((p) => p.slug)).size).toBe(PAGES.length);
    for (const p of PAGES) expect(p.file).toBeTruthy();
  });

  it("все адреса сайта уникальны — sitemap не задваивается", () => {
    const paths = allPaths();
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of ["/build-in-georgia", "/ru/build-in-georgia", "/en/build-in-georgia"]) expect(paths).toContain(path);
  });
});
