import { describe, expect, it } from "vitest";
import { translate } from "~/i18n/context";
import { dictFor } from "~/i18n/dict.server";
import overrides from "~/i18n/overrides.json";
import { checkText, emptyOverrides, mergeOverrides, parseOverrides, serializeOverrides } from "~/lib/texts-check";

// Раздел «Тексты» в админке: проверка разметки и слияние правок — защита сайта от кривого текста.
describe("проверка текста", () => {
  it("пропускает обычный текст и разрешённые теги", () => {
    expect(checkText("ka", "Цена<br>фикс", "ფასი<br>ფიქსირებული").errors).toEqual([]);
    expect(checkText("en", "Цена <em>фикс</em>", "Price <em>fixed</em>").errors).toEqual([]);
    expect(checkText("ru", "Цена", "Новая цена").errors).toEqual([]);
  });

  it("не пускает пустой текст, перенос строки и русские буквы в ka/en", () => {
    expect(checkText("en", "Цена", "  ").errors).toHaveLength(1);
    expect(checkText("en", "Цена", "a\nb").errors).toHaveLength(1);
    expect(checkText("ka", "Цена", "Цена").errors).toHaveLength(1);
  });

  it("не пускает чужие теги, атрибуты, незакрытое и комментарии", () => {
    for (const bad of ["x<script>alert(1)</script>", '<em class="a">x</em>', "x<em>y", "x</em>y", "x<br", "x <!-- c --> y", "<img src=x onerror=1>", "x</br>", "x<em/>"]) {
      expect(checkText("en", "x", bad).errors.length, bad).toBeGreaterThan(0);
    }
  });

  it("ссылки менять нельзя: адрес остаётся как в русском исходнике", () => {
    const src = 'Нажимая, вы согласны с <a href="politika.html">политикой</a>.';
    expect(checkText("en", src, 'You accept the <a href="politika.html">policy</a>.').errors).toEqual([]);
    expect(checkText("en", src, 'You accept the <a href="https://evil.example">policy</a>.').errors).toHaveLength(1);
    expect(checkText("en", src, "You accept the policy.").errors).toHaveLength(1);
  });

  it("число <br> и <em> не совпало — предупреждение, не ошибка", () => {
    const r = checkText("ka", "а<br>б", "აბ");
    expect(r.errors).toEqual([]);
    expect(r.warnings).toHaveLength(1);
  });
});

describe("слияние правок", () => {
  const ctx = { known: (k: string) => k === "Цена", base: (l: string, k: string) => (l === "ru" ? k : "BASE") };

  it("записывает правки, равные исходному убирает, null сбрасывает", () => {
    const first = mergeOverrides(emptyOverrides(), { ru: { Цена: "Стоимость" }, ka: { Цена: "ფასი" }, en: { Цена: "Price" } }, ctx as never);
    expect(first.errors).toEqual([]);
    expect(first.perLang).toEqual({ ru: 1, ka: 1, en: 1 });
    const second = mergeOverrides(first.next, { ka: { Цена: null }, en: { Цена: "BASE" } }, ctx as never);
    expect(second.next.ka).toEqual({});
    expect(second.next.en).toEqual({});
    expect(second.changed).toBe(2);
  });

  it("не принимает несуществующую строку и кривой текст", () => {
    expect(mergeOverrides(emptyOverrides(), { ka: { Нет: "x" } }, ctx as never).errors).toHaveLength(1);
    expect(mergeOverrides(emptyOverrides(), { en: { Цена: "<script>" } }, ctx as never).errors.length).toBeGreaterThan(0);
  });

  it("файл правок: стабильная запись и строгий разбор", () => {
    const text = serializeOverrides({ ru: { б: "1", а: "2" }, ka: {}, en: {} });
    expect(text.indexOf('"а"')).toBeLessThan(text.indexOf('"б"'));
    expect(parseOverrides(text).ru).toEqual({ а: "2", б: "1" });
    for (const bad of ["", "[]", '{"x":{}}', '{"ru":{"a":1}}', "{oops"]) expect(() => parseOverrides(bad)).toThrow("overrides_invalid");
  });
});

describe("правки на сайте", () => {
  it("русский текст заменяется по ключу, а без правки остаётся как есть", () => {
    expect(translate({ lang: "ru", dict: { Цена: "Стоимость" } }, "Цена")).toBe("Стоимость");
    expect(translate({ lang: "ru", dict: {} }, "Цена")).toBe("Цена");
    expect(translate({ lang: "ka", dict: { Цена: "ფასი" } }, "Цена")).toBe("ფასი");
  });

  it("словарь русского состоит только из правок, ka и en — из словарей плюс правки", () => {
    const ru = overrides.ru as Record<string, string>;
    expect(Object.keys(dictFor("ru", "kontakty")).every((k) => k in ru)).toBe(true);
    expect(Object.keys(dictFor("ka", "kontakty")).length).toBeGreaterThan(50);
    expect(Object.keys(dictFor("en", "kontakty")).length).toBeGreaterThan(50);
  });
});
