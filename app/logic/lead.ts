// Заявка (закон 7): проверка полей, отправка в Worker → Telegram и запасной
// текст для WhatsApp, если бот заявку не принял.
import type { Field, FormVariant } from "~/content/forms";
import type { Attribution } from "~/lib/attribution";
import { isValidContact } from "~/lib/phone";
import { WHATSAPP } from "~/site/contacts";
import type { Lang } from "~/site/pages";

export type Values = (name: string) => string;

/** Заполненное поле: подпись и значение — строки-пивоты, переводит вызывающий. */
export type LeadRow = { label: string; value: string };

/** Значения полей формы, обрезанные по краям. */
export function formValues(form: HTMLFormElement): Values {
  const data = new FormData(form);
  return (name) => String(data.get(name) ?? "").trim();
}

/** Имена обязательных полей, оставшихся пустыми или (для контакта) непохожих на телефон/ник. */
export function missingFields(fields: Field[], value: Values): Set<string> {
  return new Set(
    fields
      .filter((f) => f.required && (!value(f.name) || (f.name === "phone" && !isValidContact(value(f.name)))))
      .map((f) => f.name),
  );
}

export const leadRows = (fields: Field[], value: Values): LeadRow[] => fields.flatMap((f) => (value(f.name) ? [{ label: f.label, value: value(f.name) }] : []));

/** Текст для WhatsApp на языке страницы. */
export function whatsappMessage(rows: LeadRow[], t: (ru: string) => string, pageUrl: string): string {
  return [t("Здравствуйте! Хочу обсудить строительный проект."), "", ...rows.map((r) => `${t(r.label)}: ${t(r.value)}`), "", `${t("Страница")}: ${pageUrl}`].join("\n");
}

export type LeadPayload = { form: FormVariant; rows: LeadRow[]; lang: Lang; browserLang: string; page: string; attribution: Attribution | null; website: string };

/** Заявка в Telegram через Worker (workers/lead.ts). false — не дошла, остаётся WhatsApp. */
export async function sendLead(payload: LeadPayload): Promise<boolean> {
  try {
    const resp = await fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    return resp.ok;
  } catch {
    return false;
  }
}

export const whatsappLink = (message: string) => `${WHATSAPP}?text=${encodeURIComponent(message)}`;

/** Ссылка на политику в строке согласия ведёт на её версию на языке страницы. */
export const localizePrivacy = (html: string, politikaHref: string) => html.replace(/href="[^"]*politika[^"]*"/, `href="${politikaHref}"`);
