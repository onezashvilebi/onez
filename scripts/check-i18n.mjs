// После сборки: на грузинских и английских страницах не должно остаться
// кириллицы — это непереведённая строка (закон 2 из CLAUDE.md).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../build/client", import.meta.url).pathname;
const CYR = /[А-Яа-яЁё][^<>"]{0,60}/g;

function* html(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* html(p);
    else if (name.endsWith(".html")) yield p;
  }
}

/** Все строковые значения структуры JSON-LD, включая вложенные объекты и массивы. */
function* strings(value) {
  if (typeof value === "string") yield value;
  else if (Array.isArray(value)) for (const v of value) yield* strings(v);
  else if (value && typeof value === "object") for (const v of Object.values(value)) yield* strings(v);
}

/**
 * Разметка JSON-LD (`seo()` в app/lib/meta.ts) — тоже текст страницы: в FAQ,
 * крошках и описаниях переводимые строки. Из общей проверки они выпадали
 * вместе со всеми <script> (ONEZ-50), поэтому разбираются отдельно.
 */
export function jsonLdHits(source) {
  const hits = [];
  for (const [, raw] of source.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      hits.push("JSON-LD: разметка не разбирается");
      continue;
    }
    for (const s of strings(data)) for (const m of s.match(CYR) ?? []) hits.push(`JSON-LD: ${m}`);
  }
  return hits;
}

/** Кириллица в тексте страницы и в её JSON-LD; повторы схлопнуты. */
export function pageHits(source) {
  // Тело без <script> и <style>: в данных гидрации лежит русский ключ словаря, а во встроенном
  // CSS — подпись концепта на трёх языках (`content:` с html[lang]); это не текст страницы.
  const body = source.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "");
  return [...new Set([...(body.match(CYR) ?? []), ...jsonLdHits(source)])];
}

// При импорте из теста проверка не запускается — только при запуске файла.
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  let total = 0;
  for (const file of html(ROOT)) {
    const rel = relative(ROOT, file);
    // Админка — только по-русски, у неё нет языковых версий.
    if (rel.startsWith("ru/") || rel === "ru.html" || rel.startsWith("admin/")) continue;
    const hits = pageHits(readFileSync(file, "utf8"));
    if (!hits.length) continue;
    total += hits.length;
    console.log(`\n${rel}`);
    for (const h of hits.slice(0, 8)) console.log(`  · ${h.trim()}`);
    if (hits.length > 8) console.log(`  … ещё ${hits.length - 8}`);
  }
  console.log(total ? `\nuntranslated strings: ${total}` : "untranslated strings: 0");
}
