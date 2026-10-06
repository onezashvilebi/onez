import type { ChatStore, Lead } from "./chat";

// Заявка с формы → группа в Telegram (бот «Стройка Грузия», общий со stroydom.ge).
// Подписи полей приходят по-русски (пивот), значения — как ввёл посетитель;
// рядом — на каком языке ему отвечать (язык браузера, как в monkeycar/carselect).
export type LeadEnv = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_ADMIN_CHAT_ID?: string;
  /** Тот же Durable Object, что у чата: считает частоту запросов (ONEZ-47). */
  CHAT: DurableObjectNamespace<ChatStore>;
};

type Row = { label: string; value: string };

/** Не больше LEAD_LIMIT заявок в минуту с одного адреса — поток мусора не перекроет живые заявки. */
const LEAD_LIMIT = 5;

const FORM_TITLE: Record<string, string> = { estimate: "расчёт объекта", cadastral: "проверка участка", foreign: "Build in Georgia (EN)" };
const LANG_NAME: Record<string, string> = {
  ka: "грузинский", ru: "русский", en: "английский", uk: "украинский", be: "белорусский", tr: "турецкий", hy: "армянский", az: "азербайджанский",
  he: "иврит", ar: "арабский", fa: "персидский", de: "немецкий", fr: "французский", es: "испанский", it: "итальянский", pl: "польский", zh: "китайский", kk: "казахский",
};

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const json = (body: unknown, status = 200) => Response.json(body, { status });

/** На каком языке отвечать: первый язык браузера, без него — язык страницы. */
export function replyLanguage(browserLang: string, siteLang: string): string {
  const code = (browserLang.split(",")[0] || siteLang).trim().slice(0, 2).toLowerCase();
  return LANG_NAME[code] ? `${LANG_NAME[code]} (${code})` : code || siteLang;
}

/** Кнопка «ответить клиенту» прямо из сообщения: WhatsApp по номеру или Telegram по нику. */
export function replyButton(rows: Row[]): { text: string; url: string } | null {
  const contact = rows.find((r) => /Телефон|Phone/i.test(r.label))?.value ?? "";
  const nick = contact.match(/@([A-Za-z0-9_]{4,32})/)?.[1];
  if (nick) return { text: "💬 Написать в Telegram", url: `https://t.me/${nick}` };
  const digits = contact.replace(/\D/g, "");
  if (digits.length < 9) return null;
  return { text: "💬 Написать в WhatsApp", url: `https://wa.me/${digits.length === 9 ? `995${digits}` : digits}` };
}

/** Строки источника (ONEZ-27): посадочная первого входа, внешний реферер, utm_*, yclid/gclid, ClientID Метрики (ONEZ-41). */
export function sourceLines(raw: unknown): string[] {
  const a = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const s = (k: string) => str(a[k], 300);
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].map(s).filter(Boolean).join(" / ");
  return [
    s("landing") && `Вход на сайт: ${escapeHtml(s("landing"))}`,
    s("referrer") && `Откуда пришёл: ${escapeHtml(s("referrer"))}`,
    utm && `UTM: ${escapeHtml(utm)}`,
    s("yclid") && `yclid: ${escapeHtml(s("yclid"))}`,
    s("gclid") && `gclid: ${escapeHtml(s("gclid"))}`,
    /^\d{6,30}$/.test(s("clientId")) && `ClientID Метрики: ${s("clientId")}`,
  ].filter((line): line is string => Boolean(line));
}

/** Время приёма по Тбилиси — от него считается скорость первого ответа (ONEZ-42). */
export const receivedAt = () =>
  new Intl.DateTimeFormat("ru-RU", { timeZone: "Asia/Tbilisi", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date());

/** POST /api/lead → сообщение в группу с меткой ONEZ. */
export async function handleLead(request: Request, env: LeadEnv): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method" }, 405);
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_ADMIN_CHAT_ID) return json({ ok: false, error: "not_configured" }, 503);

  // Форму отправляет наша же страница: чужой origin — не заявка (как в /api/chat/send).
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ ok: false, error: "forbidden" }, 403);
  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  if (!(await env.CHAT.get(env.CHAT.idFromName("onez")).allow(`lead:${ip}`, LEAD_LIMIT))) return json({ ok: false, error: "rate_limited" }, 429);

  const body = await request.json<Record<string, unknown>>().catch(() => null);
  // website — скрытое поле-ловушка: заполняют только боты.
  if (body?.website) return json({ ok: true });
  const rows: Row[] = (Array.isArray(body?.rows) ? body.rows : [])
    .slice(0, 10)
    .map((r: { label?: unknown; value?: unknown }) => ({ label: str(r?.label, 80), value: str(r?.value, 500) }))
    .filter((r: Row) => r.label && r.value);
  if (!rows.length) return json({ ok: false, error: "invalid" }, 400);

  const lang = str(body?.lang, 5);
  const browserLang = str(body?.browserLang, 100);
  const page = str(body?.page, 300);
  const cf = request.cf as { country?: string; city?: string } | undefined;
  const source = sourceLines(body?.attribution);
  // Заявка сохраняется для админки до отправки в Telegram: даже если бот не ответил, менеджер её увидит.
  const lead: Lead = { id: `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`, at: Date.now(), form: str(body?.form, 20) || "estimate", rows, lang, page, country: cf?.country, source, delivered: false };
  const chatStore = env.CHAT.get(env.CHAT.idFromName("onez"));
  await chatStore.saveLead(lead);

  const text = [
    `🏗 <b>ONEZ</b> · новая заявка: ${escapeHtml(FORM_TITLE[str(body?.form, 20)] ?? "заявка")}`,
    `🕒 Принята: ${receivedAt()} (Тбилиси)`,
    "",
    ...rows.map((r) => `<b>${escapeHtml(r.label)}:</b> ${escapeHtml(r.value)}`),
    "",
    `🗣 Отвечать на языке: <b>${escapeHtml(replyLanguage(browserLang, lang))}</b>`,
    `Язык сайта: ${escapeHtml(lang || "—")} · браузера: ${escapeHtml(browserLang || "—")}`,
    cf?.country && `Страна: ${escapeHtml(cf.country)}${cf.city ? `, ${escapeHtml(cf.city)}` : ""}`,
    page && `Страница: ${escapeHtml(page)}`,
    ...source,
  ]
    .filter(Boolean)
    .join("\n");
  const button = replyButton(rows);

  const resp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_ADMIN_CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(button && { reply_markup: { inline_keyboard: [[button]] } }),
    }),
    signal: AbortSignal.timeout(8000),
  }).catch((err) => {
    console.error("lead.telegram fetch failed", err);
    return null;
  });

  if (!resp?.ok) {
    console.error("lead.telegram non-2xx", resp?.status, await resp?.text().catch(() => ""));
    return json({ ok: false, error: "telegram_failed" }, 502);
  }
  await chatStore.saveLead({ ...lead, delivered: true });
  return json({ ok: true });
}
