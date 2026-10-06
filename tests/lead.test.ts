import { describe, expect, it } from "vitest";
import { leadRows, missingFields, whatsappLink, whatsappMessage } from "~/logic/lead";
import type { Field } from "~/content/forms";
import { replyButton, replyLanguage, sourceLines } from "../workers/lead";

// `required` — это текст ошибки: есть строка — поле обязательное (content/forms.ts).
const fields: Field[] = [
  { name: "type", label: "Тип объекта", required: "Выберите тип объекта" },
  { name: "phone", label: "Телефон", required: "Укажите телефон или ник" },
  { name: "cadastral", label: "Кадастровый номер" },
];
const values = (data: Record<string, string>) => (name: string) => data[name] ?? "";

// Заявка — смысл сайта (закон 7): пустые и неверные поля не должны доходить до Telegram.
describe("проверка полей заявки", () => {
  it("называет незаполненные обязательные поля", () => {
    expect([...missingFields(fields, values({}))]).toEqual(["type", "phone"]);
  });

  it("считает телефон незаполненным, пока он не похож на контакт", () => {
    expect([...missingFields(fields, values({ type: "Дом", phone: "перезвоните" }))]).toEqual(["phone"]);
    expect([...missingFields(fields, values({ type: "Дом", phone: "+995 599 538 277" }))]).toEqual([]);
  });

  it("необязательное поле не блокирует отправку", () => {
    expect([...missingFields(fields, values({ type: "Дом", phone: "@ilogush" }))]).toEqual([]);
  });

  it("в сообщение попадают только заполненные поля", () => {
    expect(leadRows(fields, values({ type: "Дом", phone: "@ilogush" }))).toEqual([
      { label: "Тип объекта", value: "Дом" },
      { label: "Телефон", value: "@ilogush" },
    ]);
  });
});

describe("запасной путь в WhatsApp", () => {
  const rows = [{ label: "Телефон", value: "+995 599 538 277" }];

  it("текст содержит поля и адрес страницы", () => {
    const message = whatsappMessage(rows, (ru) => ru, "https://onez.ge/ru/kontakty");
    expect(message).toContain("Телефон: +995 599 538 277");
    expect(message).toContain("https://onez.ge/ru/kontakty");
  });

  it("ссылка несёт готовый текст", () => {
    expect(whatsappLink("Здравствуйте!")).toContain(encodeURIComponent("Здравствуйте!"));
  });
});

describe("сообщение менеджеру", () => {
  it("язык ответа берётся из браузера, без него — из языка страницы", () => {
    expect(replyLanguage("ru-RU,ru;q=0.9", "ka")).toBe("русский (ru)");
    expect(replyLanguage("", "ka")).toBe("грузинский (ka)");
    expect(replyLanguage("sv-SE", "ka")).toBe("sv");
  });

  it("кнопка ответа ведёт в Telegram по нику и в WhatsApp по номеру", () => {
    expect(replyButton([{ label: "Телефон", value: "@ilogush" }])?.url).toBe("https://t.me/ilogush");
    expect(replyButton([{ label: "Телефон", value: "599 538 277" }])?.url).toBe("https://wa.me/995599538277");
    expect(replyButton([{ label: "Телефон", value: "+995 599 538 277" }])?.url).toBe("https://wa.me/995599538277");
    expect(replyButton([{ label: "Тип объекта", value: "Дом" }])).toBeNull();
  });

  it("источник визита пересказывается строками, пустое пропускается", () => {
    expect(sourceLines(null)).toEqual([]);
    const lines = sourceLines({ landing: "/ru/cena", referrer: "https://yandex.ru/", utm_source: "yandex", utm_medium: "cpc" });
    expect(lines.join("\n")).toContain("Вход на сайт: /ru/cena");
    expect(lines.join("\n")).toContain("UTM: yandex / cpc");
  });

  it("ClientID Метрики — только цифры, иначе строка не выводится (ONEZ-41)", () => {
    expect(sourceLines({ clientId: "1758450000123456789" })).toEqual(["ClientID Метрики: 1758450000123456789"]);
    expect(sourceLines({ clientId: "<script>" })).toEqual([]);
  });

  it("разметка Telegram экранируется — чужой HTML не ломает сообщение", () => {
    expect(sourceLines({ referrer: "<b>x</b>" }).join("")).toContain("&lt;b&gt;x&lt;/b&gt;");
  });
});
