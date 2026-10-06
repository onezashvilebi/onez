import { describe, expect, it } from "vitest";
import { extractContact, isValidContact } from "~/lib/phone";

// Один стандарт контакта для формы заявки и окна чата: телефон или ник мессенджера.
describe("isValidContact", () => {
  it("принимает грузинский номер в разных записях", () => {
    for (const v of ["+995 599 538 277", "995599538277", "599 538 277", "(599) 538-277"]) expect(isValidContact(v)).toBe(true);
  });

  it("принимает ник мессенджера от четырёх знаков", () => {
    expect(isValidContact("@ilogush")).toBe(true);
    expect(isValidContact("@abc")).toBe(false);
  });

  it("отклоняет пустое, слишком короткое и текст", () => {
    for (const v of ["", "   ", "12345", "позвоните мне", "почта@onez.ge"]) expect(isValidContact(v)).toBe(false);
  });
});

describe("extractContact", () => {
  it("находит номер внутри фразы", () => {
    expect(extractContact("здравствуйте, мой номер +995 599 538 277, жду")).toBe("+995 599 538 277");
  });

  it("находит ник, когда номера нет", () => {
    expect(extractContact("пишите мне в телеграм @ilogush")).toBe("@ilogush");
  });

  it("возвращает null, когда контакта нет", () => {
    expect(extractContact("сколько стоит каркас дома 200 м2?")).toBeNull();
  });

  it("не принимает короткий набор цифр за телефон", () => {
    expect(extractContact("дом 200 м2, бюджет 150000")).toBeNull();
  });
});
