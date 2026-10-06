#!/usr/bin/env node
// Заголовок Last-Modified для страниц с датой правки текста (свод v3, правило 22:
// видимая дата = dateModified = lastmod = Last-Modified). Источник один — lastmod
// собранного sitemap.xml, то есть logic/modified.ts. Строки дописываются в
// build/client/_headers (копию public/_headers), сам public/_headers не меняется.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("../build/client/", import.meta.url).pathname;
const sitemap = readFileSync(`${ROOT}sitemap.xml`, "utf8");
const rules = [];
for (const [, url, lastmod] of sitemap.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)) {
  const path = new URL(url).pathname;
  rules.push(`${path}\n  Last-Modified: ${new Date(`${lastmod}T00:00:00Z`).toUTCString()}`);
}

const headers = readFileSync(`${ROOT}_headers`, "utf8");
// Правил в _headers у Static Assets не больше 100: запас проверяем здесь, а не на проде.
const total = (headers.match(/^\/\S/gm) ?? []).length + rules.length;
if (total > 100) {
  console.error(`last-modified: ${total} правил в _headers — предел Cloudflare 100. Сузь список.`);
  process.exit(2);
}
writeFileSync(`${ROOT}_headers`, `${headers.trimEnd()}\n\n# Last-Modified страниц с датой правки текста (scripts/last-modified.mjs, правило 22).\n${rules.join("\n")}\n`);
console.log(`last-modified: ${rules.length} адресов, правил в _headers ${total}`);
