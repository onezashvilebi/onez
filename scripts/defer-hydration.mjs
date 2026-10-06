#!/usr/bin/env node
// Гидрация после отрисовки (ONEZ-22). React Router печатает в каждую
// пререндеренную страницу 20+ <link rel="modulepreload"> и модуль со
// статическими import: браузер качает ~260 КБ JS одновременно с героем, и
// Lighthouse mobile считает этот JS частью пути к первой отрисовке — LCP
// внутренних страниц 3,3–4,5 с при готовом HTML. Страница целиком собрана
// пререндером, JS нужен только для интерактива, поэтому:
//   1. modulepreload-ссылки из HTML убираются;
//   2. модуль гидрации ждёт события load и следующего кадра после него (или
//      3,5 с, если load затянулся), затем сам ставит те же modulepreload и
//      грузит модули маршрута. Кадр нужен потому, что на быстром канале load
//      наступает раньше первой отрисовки и JS снова встаёт перед LCP.
// Форма до гидрации не отправляется (страж в lib/boot.ts), переходы по ссылкам
// до гидрации — обычные переходы на готовый HTML.
//
// Скрипт правит build/client после `react-router build`; если разметка React
// Router изменилась и шаблон не найден — сборка падает, а не молча теряет
// гидрацию.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../build/client/", import.meta.url).pathname;
const PRELOAD = /<link rel="modulepreload" href="([^"]+)"\/>/g;
const MODULE = /<script type="module" async="">([\s\S]*?)<\/script>/;
const IMPORT = /import \* as (route\d+) from "([^"]+)";/g;

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return e.name === "assets" ? [] : htmlFiles(p);
    return e.name === "index.html" ? [p] : [];
  });
}

export function deferHydration(html) {
  const preloads = [...html.matchAll(PRELOAD)].map((m) => m[1]);
  const module = html.match(MODULE);
  if (!preloads.length || !module) return null;
  const imports = [...module[1].matchAll(IMPORT)];
  if (!imports.length || !module[1].includes("window.__reactRouterRouteModules")) return null;
  const names = imports.map((m) => m[1]).join(",");
  const loads = imports.map((m) => `import(${JSON.stringify(m[2])})`).join(",");
  const wait =
    `await new Promise(function(r){function p(){if(document.hidden)return setTimeout(r,0);requestAnimationFrame(function(){setTimeout(r,0)})}if(document.readyState==="complete")p();else addEventListener("load",p,{once:true});setTimeout(r,3500)});` +
    `${JSON.stringify(preloads)}.forEach(function(u){var l=document.createElement("link");l.rel="modulepreload";l.href=u;document.head.appendChild(l)});` +
    `const [${names}]=await Promise.all([${loads}]);`;
  const body = wait + module[1].replace(IMPORT, "");
  return html.replace(PRELOAD, "").replace(module[0], () => `<script type="module" async="">${body}</script>`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = htmlFiles(ROOT);
  let done = 0;
  const failed = [];
  for (const f of files) {
    const out = deferHydration(readFileSync(f, "utf8"));
    if (out === null) failed.push(f.slice(ROOT.length));
    else { writeFileSync(f, out); done++; }
  }
  if (failed.length) {
    console.error(`defer-hydration: не найден шаблон React Router в ${failed.length} из ${files.length}: ${failed.slice(0, 5).join(", ")}`);
    process.exit(2);
  }
  console.log(`defer-hydration: гидрация после load на ${done} страницах`);
}
