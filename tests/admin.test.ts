import { describe, expect, it } from "vitest";
import { issueToken, samePassword, summary, verifyToken } from "../workers/admin-auth";

// Вход в админку — по паролю из секрета; токен в куке проверяется без хранилища.
describe("токен админки", () => {
  it("выданный токен проходит проверку тем же секретом", async () => {
    const token = await issueToken("secret-1");
    expect(await verifyToken("secret-1", token)).toBe(true);
  });

  it("чужой секрет, порча и отсутствие токена — отказ", async () => {
    const token = await issueToken("secret-1");
    expect(await verifyToken("secret-2", token)).toBe(false);
    expect(await verifyToken("secret-1", token.slice(0, -1) + "x")).toBe(false);
    expect(await verifyToken("secret-1", undefined)).toBe(false);
    expect(await verifyToken("secret-1", "1.2.3")).toBe(false);
  });

  it("просроченный токен не принимается", async () => {
    const token = await issueToken("secret-1", Date.now() - 31 * 24 * 3600 * 1000);
    expect(await verifyToken("secret-1", token)).toBe(false);
  });
});

describe("сравнение пароля", () => {
  it("совпадает только полностью", () => {
    expect(samePassword("abc", "abc")).toBe(true);
    expect(samePassword("abc", "abd")).toBe(false);
    expect(samePassword("abc", "ab")).toBe(false);
    expect(samePassword("", "")).toBe(true);
  });
});

describe("сводка разговора", () => {
  it("считает непрочитанные сообщения посетителя после отметки менеджера", () => {
    const s = summary({
      id: "s1", page: "/ru", lang: "ru", browserLang: "ru", lastAt: 3, seenAt: 1, contact: "+995 599 538 277",
      messages: [
        { id: 1, from: "visitor", text: "первое", at: 1 },
        { id: 2, from: "agent", text: "ответ", at: 2, author: "Ассистент ONEZ" },
        { id: 3, from: "visitor", text: "второе", at: 3 },
      ],
    });
    expect(s.unread).toBe(1);
    expect(s.last?.text).toBe("второе");
    expect(s.contact).toBe("+995 599 538 277");
    expect(s.manual).toBe(false);
  });
});
