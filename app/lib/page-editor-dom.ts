// DOM-часть редактора страниц (раздел «Страницы» админки). Страница показывается в
// iframe без скриптов (sandbox="allow-same-origin"): это готовый пререндер, без
// гидрации, аналитики и чата, поэтому его можно спокойно править «снаружи».
// Админка находит на странице тексты из словаря — по совпадению разметки элемента
// с текстом строки — и помечает их атрибутом data-onez-edit. Клик по помеченному
// тексту открывает три языка этой строки в панели справа. Файл не знает про React:
// только документ и функции.

export type Flag = { el: HTMLElement; keys: string[] };
export type Block = { el: HTMLElement; label: string };

/** Теги, внутри которых может лежать разметка строки (<br>, <em>, ссылка и т. п.). */
const INLINE = new Set(["br", "em", "b", "strong", "i", "a", "span", "small", "sup", "sub", "wbr"]);
const SKIP = new Set(["script", "style", "noscript", "template", "textarea", "input", "select", "option", "iframe", "canvas", "video", "picture", "img", "svg"]);

/** Приводит разметку к виду для сравнения: без комментариев React, пробелы схлопнуты. */
export const normalize = (html: string) => html.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").trim();

/** Разметка в том виде, как её отдаёт браузер (`&` → `&amp;`, `<br/>` → `<br>`): так сравнивать честно. */
export function canonical(doc: Document, html: string): string {
  const tpl = doc.createElement("template");
  tpl.innerHTML = html;
  return normalize(tpl.innerHTML);
}

function isCandidate(el: Element): boolean {
  if (SKIP.has(el.localName) || el.closest("svg, script, style, noscript, template")) return false;
  for (const child of Array.from(el.children)) if (!INLINE.has(child.localName)) return false;
  return Boolean(el.textContent?.trim());
}

/**
 * Помечает элементы, чьё содержимое совпало с показываемым текстом какой-то строки.
 * `index`: нормализованная разметка → русские ключи строк (ключей несколько, если
 * два русских текста переводятся одинаково). Идём с конца: вложенный элемент
 * помечается раньше родителя, а родитель с уже помеченным потомком пропускается.
 */
export function scanEditable(doc: Document, index: Map<string, string[]>): Flag[] {
  const flags: Flag[] = [];
  const all = Array.from(doc.body.querySelectorAll<HTMLElement>("*"));
  for (let i = all.length - 1; i >= 0; i--) {
    const el = all[i]!;
    if (!isCandidate(el) || el.querySelector("[data-onez-edit]")) continue;
    const keys = index.get(normalize(el.innerHTML));
    if (!keys) continue;
    el.setAttribute("data-onez-edit", "");
    flags.push({ el, keys });
  }
  return flags.reverse();
}

const STYLE_ID = "onez-edit-style";
const CSS = `
[data-onez-edit]{cursor:pointer!important}
html.onez-show [data-onez-edit]{outline:1px dashed rgba(84,201,184,.75);outline-offset:3px}
[data-onez-edit]:hover{outline:2px solid #54c9b8!important;outline-offset:3px}
[data-onez-active]{outline:2px solid #e07a3c!important;outline-offset:3px;background-color:rgba(224,122,60,.14)!important}
[data-onez-flash]{outline:3px solid #54c9b8!important;outline-offset:-3px}
`;

/** Режим правки: подсветка, клик выбирает текст, а любые переходы и отправки форм гасятся. */
export function installEditUi(doc: Document, onPick: (el: HTMLElement) => void): () => void {
  doc.getElementById(STYLE_ID)?.remove();
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.appendChild(style);
  const click = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
    const el = (ev.target as Element | null)?.closest<HTMLElement>("[data-onez-edit]");
    if (el) onPick(el);
  };
  const block = (ev: Event) => ev.preventDefault();
  doc.addEventListener("click", click, true);
  doc.addEventListener("auxclick", block, true);
  doc.addEventListener("submit", block, true);
  return () => {
    doc.removeEventListener("click", click, true);
    doc.removeEventListener("auxclick", block, true);
    doc.removeEventListener("submit", block, true);
    style.remove();
  };
}

export function setActive(doc: Document, el: HTMLElement | null) {
  for (const old of Array.from(doc.querySelectorAll("[data-onez-active]"))) old.removeAttribute("data-onez-active");
  el?.setAttribute("data-onez-active", "");
}

export function showAll(doc: Document, on: boolean) {
  doc.documentElement.classList.toggle("onez-show", on);
}

/** Вставляет разметку в элемент, только если она изменилась (иначе пересборка DOM на каждый символ). */
const applied = new WeakMap<HTMLElement, string>();
export function applyHtml(el: HTMLElement, html: string) {
  if (!applied.has(el)) applied.set(el, el.innerHTML);
  if (applied.get(el) === html) return;
  el.innerHTML = html;
  applied.set(el, html);
}
/** Исходная разметка элемента, какой её отдал сервер. */
const originals = new WeakMap<HTMLElement, string>();
export function rememberOriginal(el: HTMLElement) {
  if (!originals.has(el)) originals.set(el, el.innerHTML);
}
export const originalHtml = (el: HTMLElement) => originals.get(el) ?? el.innerHTML;

/** Крупные блоки страницы (верхние <section> в <main>): основа для будущей работы с блоками. */
export function listBlocks(doc: Document): Block[] {
  const root = doc.querySelector("main") ?? doc.body;
  const out: Block[] = [];
  for (const section of Array.from(root.querySelectorAll<HTMLElement>("section"))) {
    if (section.parentElement?.closest("section")) continue;
    // <br> в заголовке не должен склеивать слова: «дома<br>растёт» → «дома растёт».
    const heading = section.querySelector("h1, h2, h3")?.cloneNode(true) as HTMLElement | undefined;
    for (const br of Array.from(heading?.querySelectorAll("br") ?? [])) br.replaceWith(" ");
    const label = (heading?.textContent ?? section.getAttribute("aria-label") ?? section.id ?? "").replace(/\s+/g, " ").trim().slice(0, 60);
    out.push({ el: section, label: label || `Блок ${out.length + 1}` });
  }
  return out;
}

export function flashBlock(el: HTMLElement) {
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.setAttribute("data-onez-flash", "");
  setTimeout(() => el.removeAttribute("data-onez-flash"), 1200);
}
