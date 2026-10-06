import { describe, expect, it } from "vitest";
// @ts-expect-error — скрипт сборки на чистом JS без деклараций типов
import { deferHydration } from "../scripts/defer-hydration.mjs";

// Разметка, которую печатает <Scripts /> React Router в пререндере (ONEZ-22).
const HTML = `<head></head><body><main>x</main><link rel="modulepreload" href="/assets/entry.client-A.js"/><link rel="modulepreload" href="/assets/root-B.js"/><script type="module" async="">;
import * as route0 from "/assets/root-B.js";
import * as route1 from "/assets/page-C.js";
  window.__reactRouterManifest = {};
  window.__reactRouterRouteModules = {"root":route0,"page":route1};

import("/assets/entry.client-A.js");</script></body>`;

describe("гидрация после load", () => {
  const out = deferHydration(HTML) as string;

  it("убирает modulepreload из HTML и ставит их после load", () => {
    expect(out).not.toContain('<link rel="modulepreload"');
    expect(out).toContain('["/assets/entry.client-A.js","/assets/root-B.js"]');
    expect(out.indexOf('addEventListener("load"')).toBeLessThan(out.indexOf("modulepreload"));
  });

  it("статические import маршрутов превращаются в import() после ожидания", () => {
    expect(out).not.toMatch(/import \* as route/);
    expect(out).toContain('const [route0,route1]=await Promise.all([import("/assets/root-B.js"),import("/assets/page-C.js")]);');
    expect(out).toContain('window.__reactRouterRouteModules = {"root":route0,"page":route1};');
    expect(out).toContain('import("/assets/entry.client-A.js");');
  });

  it("незнакомая разметка — null, а не молча сломанная страница", () => {
    expect(deferHydration("<body><main>x</main></body>")).toBeNull();
    expect(deferHydration(HTML.replace(/<link[^>]*>/g, ""))).toBeNull();
  });
});
