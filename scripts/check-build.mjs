#!/usr/bin/env node
// Страж сборки перед коммитом и деплоем (хук в .claude/settings.json):
// главные трёх языков — полные страницы, а не заглушки редиректа (12.09.2026
// правило в _redirects превратило /ru и /en в <meta refresh> на сутки);
// непереведённых строк — ноль (закон 2).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";

const ROOT = new URL("../build/client/", import.meta.url).pathname;
const PAGES = [["index.html", "ONEZA Construction —"], ["ru/index.html", "генподрядчик"], ["en/index.html", "general contractor"]];
const problems = [];

if (!existsSync(ROOT + "index.html")) problems.push("нет сборки: запусти `npm run build` в web/");
else {
  for (const [file, mark] of PAGES) {
    const html = existsSync(ROOT + file) ? readFileSync(ROOT + file, "utf8") : "";
    if (html.length < 20_000) problems.push(`${file}: ${html.length} байт — заглушка вместо страницы`);
    else if (html.includes('name="robots" content="noindex"')) problems.push(`${file}: стоит noindex`);
    else if (!html.includes(mark)) problems.push(`${file}: нет ожидаемого заголовка «${mark}»`);
    else if (html.includes('<link rel="modulepreload"') || !html.includes('addEventListener("load"')) problems.push(`${file}: гидрация не отложена до load (scripts/defer-hydration.mjs, ONEZ-22)`);
  }
  seoChecks(problems);
  const i18n = execFileSync("node", [new URL("./check-i18n.mjs", import.meta.url).pathname], { encoding: "utf8" });
  const m = i18n.match(/untranslated strings: (\d+)/);
  if (!m || m[1] !== "0") problems.push(`непереведённые строки: ${m?.[1] ?? "?"} — переводы в app/i18n/extra.json`);
}

/**
 * SEO-регрессии перед деплоем (свод v3, правило 45): на каждой собранной
 * странице — ровно один h1, canonical, разбираемый JSON-LD; заголовки страниц
 * не повторяются; robots.txt открыт поисковым и ответным ботам и закрыт для
 * CCBot и Bytespider. Админка — служебная страница, её не проверяем.
 */
function seoChecks(problems) {
  const titles = new Map();
  for (const file of htmlFiles(ROOT)) {
    const page = relative(ROOT, file);
    if (page.startsWith("admin")) continue;
    const html = readFileSync(file, "utf8");
    const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) problems.push(`${page}: h1 на странице ${h1}, должен быть один`);
    if (!html.includes('rel="canonical"')) problems.push(`${page}: нет canonical`);
    for (const [, raw] of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(raw);
      } catch {
        problems.push(`${page}: JSON-LD не разбирается`);
      }
    }
    const noindex = html.includes('name="robots" content="noindex"');
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    if (!noindex && title) {
      if (titles.has(title)) problems.push(`${page}: тот же <title>, что у ${titles.get(title)}`);
      else titles.set(title, page);
    }
  }
  const robots = readFileSync(`${ROOT}robots.txt`, "utf8");
  for (const ua of ["Googlebot", "YandexAdditional", "GPTBot", "OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "Bingbot"])
    if (!robots.includes(`User-agent: ${ua}`)) problems.push(`robots.txt: нет группы для ${ua}`);
  if (!/User-agent: CCBot\nUser-agent: Bytespider\nDisallow: \//.test(robots)) problems.push("robots.txt: CCBot и Bytespider должны быть закрыты (правило 25)");
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith(".html")) yield p;
  }
}

if (problems.length) {
  console.error("Сборка не прошла проверку:\n  · " + problems.join("\n  · "));
  process.exit(2);
}
console.log("Сборка в порядке: главные /, /ru, /en полные, по одному h1 и canonical на странице, дублей title нет, JSON-LD разбирается, robots открыт ботам, переводов не хватает 0.");
