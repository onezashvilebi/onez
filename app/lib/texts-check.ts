// Проверка и слияние правок текстов (раздел «Тексты» в админке). Только чистые
// функции, без Cloudflare и React: воркер (workers/texts.ts) вызывает их как
// последнюю линию защиты перед коммитом в GitHub, браузер — для подсказок под полем.
//
// Файл правок app/i18n/overrides.json: { ru: {}, ka: {}, en: {} }. Ключ — русская
// строка из кода (его не меняем), значение — текст, который показывает сайт.

export const TEXT_LANGS = ["ru", "ka", "en"] as const;
export type TextLang = (typeof TEXT_LANGS)[number];
export type Overrides = Record<TextLang, Record<string, string>>;
/** Правки от браузера: строка — новый текст, null — вернуть исходный. */
export type Changes = Partial<Record<TextLang, Record<string, string | null>>>;
export type TextCheck = { errors: string[]; warnings: string[]; value: string };
export type MergeIssue = { lang: TextLang; key: string; message: string };

/** Предел длины одной строки: самые длинные абзацы сайта втрое короче. */
export const MAX_VALUE = 4000;
/** Предел правок за одну публикацию. */
export const MAX_CHANGES = 600;

const CYRILLIC = /[А-Яа-яЁё]/;
const CONTROL = /[\u0000-\u001f\u007f]/;
const TAG = /<\/?[a-zA-Z][^<>]*>/g;
const SIMPLE = /^<(\/?)(br|em|b)\s*(\/?)>$/i;
const ANCHOR_OPEN = /^<a(?:\s[^<>]*)?>$/i;
const ANCHOR_CLOSE = /^<\/a\s*>$/i;

const tagsOf = (s: string) => s.match(TAG) ?? [];
const countOf = (tags: string[], name: string) => tags.filter((t) => new RegExp(`^<${name}\\s*/?>$`, "i").test(t)).length;
const anchorsOf = (tags: string[]) => tags.filter((t) => ANCHOR_OPEN.test(t)).map((t) => t.replace(/\s+/g, " ").toLowerCase());

/**
 * Проверка одного текста. `source` — русская строка-ключ: по ней сверяются ссылки и
 * теги. Ошибки блокируют публикацию, предупреждения — нет (в грузинском и английском
 * переносы и выделения законно ложатся иначе, чем в русском).
 */
export function checkText(lang: TextLang, source: string, input: string): TextCheck {
  const value = input.trim();
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!value) return { errors: ["Пустой текст. Чтобы вернуть исходный, нажмите «К исходному»."], warnings, value };

  if (value.length > MAX_VALUE) errors.push(`Слишком длинный текст: больше ${MAX_VALUE} знаков.`);
  if (CONTROL.test(value)) errors.push("Перенос строки и табуляция не нужны: для переноса используйте тег <br>.");
  if (lang !== "ru" && CYRILLIC.test(value)) errors.push("Русские буквы в грузинском и английском тексте не допускаются.");

  const tags = tagsOf(value);
  const rest = value.replace(TAG, "");
  if (/[<>]/.test(rest) && !/[<>]/.test(source.replace(TAG, ""))) errors.push("Одиночный знак < или >. Сам знак пишите как &lt; или &gt;.");

  const stack: string[] = [];
  for (const tag of tags) {
    const m = SIMPLE.exec(tag);
    if (m) {
      const closing = m[1] === "/";
      const name = (m[2] ?? "").toLowerCase();
      if (name === "br") {
        if (closing) errors.push("Тега </br> не существует: пишите <br>.");
      } else if (m[3] === "/") {
        errors.push(`Тег ${tag} нельзя закрывать сам на себя.`);
      } else if (!closing) {
        stack.push(name);
      } else if (stack.pop() !== name) {
        errors.push(`Тег ${tag} закрыт не там, где открыт.`);
      }
    } else if (ANCHOR_OPEN.test(tag)) {
      stack.push("a");
    } else if (ANCHOR_CLOSE.test(tag)) {
      if (stack.pop() !== "a") errors.push(`Тег ${tag} закрыт не там, где открыт.`);
    } else {
      errors.push(`Тег ${tag} не разрешён. Можно только <br>, <em>, <b>.`);
    }
  }
  for (const open of stack) errors.push(`Не закрыт тег <${open}>.`);

  const sourceTags = tagsOf(source);
  if (anchorsOf(tags).join("|") !== anchorsOf(sourceTags).join("|")) errors.push("Ссылки (<a …>) менять нельзя: оставьте их ровно такими, как в русском исходнике.");

  for (const name of ["br", "em", "b"]) {
    const was = countOf(sourceTags, name);
    const now = countOf(tags, name);
    if (was !== now) warnings.push(`Тегов <${name}> в русском исходнике ${was}, здесь ${now}. Проверьте, что так задумано.`);
  }
  return { errors: [...new Set(errors)], warnings, value };
}

export const emptyOverrides = (): Overrides => ({ ru: {}, ka: {}, en: {} });
const cloneOverrides = (o: Overrides): Overrides => ({ ru: { ...o.ru }, ka: { ...o.ka }, en: { ...o.en } });

/** Разбор файла правок. Любое отклонение от формата — ошибка: молча перезаписывать чужое нельзя. */
export function parseOverrides(text: string): Overrides {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("overrides_invalid");
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("overrides_invalid");
  const record = data as Record<string, unknown>;
  if (Object.keys(record).some((k) => !(TEXT_LANGS as readonly string[]).includes(k))) throw new Error("overrides_invalid");
  const out = emptyOverrides();
  for (const lang of TEXT_LANGS) {
    const part = record[lang];
    if (part === undefined) continue;
    if (!part || typeof part !== "object" || Array.isArray(part)) throw new Error("overrides_invalid");
    for (const [key, value] of Object.entries(part)) {
      if (typeof value !== "string") throw new Error("overrides_invalid");
      if (key !== "__proto__") out[lang][key] = value;
    }
  }
  return out;
}

/** Стабильная запись: ключи по алфавиту, чтобы в истории GitHub менялись только нужные строки. */
export function serializeOverrides(o: Overrides): string {
  const sorted = emptyOverrides();
  for (const lang of TEXT_LANGS) for (const key of Object.keys(o[lang]).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) sorted[lang][key] = o[lang][key] as string;
  return `${JSON.stringify(sorted, null, 2)}\n`;
}

export const sameOverrides = (a: Overrides, b: Overrides) => serializeOverrides(a) === serializeOverrides(b);

export type MergeContext = {
  /** Есть ли такая строка на сайте: чужие и выдуманные ключи не принимаем. */
  known: (key: string) => boolean;
  /** Исходный текст строки на языке: русский — сам ключ, ka/en — из словарей. */
  base: (lang: TextLang, key: string) => string;
};

export type MergeResult = { next: Overrides; errors: MergeIssue[]; warnings: MergeIssue[]; changed: number; perLang: Record<TextLang, number> };

/** Накладывает правки на текущие. Текст, равный исходному, правкой не считается и из файла уходит. */
export function mergeOverrides(current: Overrides, changes: Changes, ctx: MergeContext): MergeResult {
  const next = cloneOverrides(current);
  const errors: MergeIssue[] = [];
  const warnings: MergeIssue[] = [];
  let total = 0;
  for (const lang of TEXT_LANGS) {
    const part = changes[lang];
    if (!part || typeof part !== "object") continue;
    for (const [key, raw] of Object.entries(part)) {
      total++;
      if (!ctx.known(key)) {
        errors.push({ lang, key, message: "Такой строки на сайте нет." });
        continue;
      }
      if (raw === null) {
        delete next[lang][key];
        continue;
      }
      if (typeof raw !== "string") {
        errors.push({ lang, key, message: "Текст должен быть строкой." });
        continue;
      }
      const check = checkText(lang, key, raw);
      for (const message of check.errors) errors.push({ lang, key, message });
      for (const message of check.warnings) warnings.push({ lang, key, message });
      if (check.errors.length) continue;
      if (check.value === ctx.base(lang, key)) delete next[lang][key];
      else next[lang][key] = check.value;
    }
  }
  if (total > MAX_CHANGES) errors.push({ lang: "ru", key: "", message: `За один раз можно опубликовать не больше ${MAX_CHANGES} правок.` });

  const perLang: Record<TextLang, number> = { ru: 0, ka: 0, en: 0 };
  for (const lang of TEXT_LANGS) {
    const keys = new Set([...Object.keys(current[lang]), ...Object.keys(next[lang])]);
    for (const key of keys) if (current[lang][key] !== next[lang][key]) perLang[lang]++;
  }
  return { next, errors, warnings, changed: perLang.ru + perLang.ka + perLang.en, perLang };
}
