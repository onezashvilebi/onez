// Карта «страница → нужные ей ключи словаря» (ONEZ-54).
//
// Словарь целиком уезжал в HTML каждой страницы: 293 КБ на ka и en против
// пустого словаря на ru, то есть основной язык сайта получал самую тяжёлую
// версию. Здесь из собранных страниц собирается, какие строки на каждой из них
// действительно видны, и к ним добавляется белый список динамики — строки из
// компонентов, форм, хуков и логики: они появляются после действия (ошибка
// валидации, экран «Заявка отправлена», чат) и в HTML их нет.
//
// Запуск: `npm run i18n` (после `npm run build`), затем сборка ещё раз —
// `dictFor()` читает готовую карту. Нет карты или нет записи для страницы —
// отдаётся полный словарь, поэтому промежуточная сборка не ломается.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const WEB = new URL("..", import.meta.url).pathname;
const BUILD = join(WEB, "build/client");
const OUT = join(WEB, "app/i18n/pages.json");

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const ka = read(join(WEB, "app/i18n/ka.json"));
const extra = read(join(WEB, "app/i18n/extra.json"));
const dict = { ...ka, ...extra.ka };

/** Строковые литералы файла в любых кавычках: строка формы объявлена через \'…\'. */
function literals(src) {
  const out = [];
  for (const m of src.matchAll(/(["'`])((?:[^\\\n]|\\.)*?)\1/g)) if (dict[m[2]]) out.push(m[2]);
  return out;
}

/** Строки, которые появляются только после действия пользователя: в HTML их нет. */
function dynamicKeys() {
  const keys = new Set();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx|ts)$/.test(name) && !p.includes("/i18n/")) {
        for (const k of literals(readFileSync(p, "utf8"))) keys.add(k);
      }
    }
  };
  for (const d of ["app/components", "app/hooks", "app/logic", "app/lib", "app/routes"]) walk(join(WEB, d));
  for (const f of ["app/content/forms.ts"]) for (const k of literals(readFileSync(join(WEB, f), "utf8"))) keys.add(k);
  return keys;
}

/** Страницы грузинской сборки: по ним видно, какие переводы стоят в разметке. */
function* pages(dir, base = "") {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "ru" || name === "en" || name === "assets" || name === "fonts") continue;
    if (statSync(p).isDirectory()) yield* pages(p, base ? `${base}/${name}` : name);
    else if (name === "index.html") yield [base, p];
  }
}

if (!existsSync(BUILD)) {
  console.log("i18n-pages: нет build/client — карта не обновлена");
  process.exit(0);
}

const dyn = dynamicKeys();
const map = {};
let min = Infinity;
let max = 0;
for (const [slug, file] of pages(BUILD)) {
  // Данные React Router несут словарь целиком — по ним нельзя судить о странице.
  const visible = readFileSync(file, "utf8").replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");
  const keys = new Set(dyn);
  // Те же подстановки, что делает translate(): иначе строка с «м²» или «К-1»
  // не найдётся в разметке и выпадет из словаря страницы.
  const norm = (s) => s.replaceAll("м²", "მ²").replace(/К-(\d)/g, "კ-$1");
  const html = visible.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
  // Ключ берётся и по переводу в разметке, и по самой русской строке: если текст
  // на странице новый и ещё не переведён, иначе карта его не увидит никогда и
  // строка останется русской на ka и en после каждой пересборки.
  for (const [ru, tr] of Object.entries(dict)) if (tr && (html.includes(norm(tr)) || html.includes(norm(ru)))) keys.add(ru);
  map[slug] = [...keys].sort();
  min = Math.min(min, keys.size);
  max = Math.max(max, keys.size);
}

writeFileSync(OUT, JSON.stringify(map, null, 0) + "\n");
const total = Object.keys(dict).length;
console.log(`i18n-pages: ${Object.keys(map).length} страниц, ключей на страницу ${min}–${max} из ${total}`);
