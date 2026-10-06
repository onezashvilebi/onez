// Онлайн-чат сайта: посетителю отвечает Workers AI строго по фактам сайта
// (chat-prompt.ts). Без контакта в группу Telegram не уходит ничего: окно чата
// после первого сообщения требует телефон или ник мессенджера. Как только
// контакт появился — в группу идёт сводка разговора, а дальше каждое новое
// сообщение посетителя: менеджеру есть кому отвечать.
// Переписка живёт в Durable Object ChatStore (прав на KV у токена деплоя нет).
import { DurableObject } from "cloudflare:workers";
import { extractContact } from "~/lib/phone";
import { chatSystemPrompt } from "./chat-prompt";
import { receivedAt, replyButton, replyLanguage, sourceLines } from "./lead";

export type ChatMessage = { id: number; from: "visitor" | "agent"; text: string; at: number; author?: string };
/**
 * `contact` — телефон или ник, с которого разговор стал заявкой; `notified` — сводка по нему
 * ушла в группу; `manual` — менеджер ответил из админки, ассистент в этом разговоре молчит;
 * `seenAt` — до какого сообщения менеджер дочитал (непрочитанные считает админка).
 */
export type Session = { id: string; page: string; lang: string; browserLang: string; lastAt: number; messages: ChatMessage[]; contact?: string; notified?: boolean; manual?: boolean; seenAt?: number; source?: string[] };

/** Заявка с формы, сохранённая для админки (workers/lead.ts). */
export type Lead = { id: string; at: number; form: string; rows: { label: string; value: string }[]; lang: string; page: string; country?: string; source: string[]; delivered: boolean; done?: boolean };
const MAX_LEADS = 500;

export type ChatEnv = {
  TELEGRAM_BOT_TOKEN?: string;
  /** Группа заявок: чат пишет туда же, отдельного секрета ей не нужно. */
  TELEGRAM_ADMIN_CHAT_ID?: string;
  /** Устаревшая переменная под ту же группу; остаётся, пока секрет не снят с воркера. */
  TELEGRAM_CHAT_GROUP_ID?: string;
  CHAT: DurableObjectNamespace<ChatStore>;
  AI: Ai;
};

const COOKIE = "onez_chat";
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;
const MAX_MESSAGES = 200;
const MAX_TEXT = 2000;
const HISTORY_TURNS = 8;
const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
/** Подпись ассистента: посетитель видит, что отвечает не человек. */
const ASSISTANT = "Ассистент ONEZ";

/** Одна база на весь сайт: сессии чата и счётчики частоты запросов. */
export class ChatStore extends DurableObject {
  async session(id: string): Promise<Session | null> {
    return (await this.ctx.storage.get<Session>(`s:${id}`)) ?? null;
  }

  async create(meta: Pick<Session, "page" | "lang" | "browserLang" | "source">): Promise<Session> {
    const s: Session = { id: crypto.randomUUID(), ...meta, lastAt: Date.now(), messages: [] };
    await this.ctx.storage.put(`s:${s.id}`, s);
    return s;
  }

  /** Сообщение добавляется внутри объекта — параллельные запросы не затирают друг друга. */
  async append(id: string, msg: Pick<ChatMessage, "from" | "text" | "author">): Promise<Session | null> {
    const s = await this.session(id);
    if (!s) return null;
    s.messages.push({ ...msg, id: Math.max(Date.now(), (s.messages.at(-1)?.id ?? 0) + 1), at: Date.now() });
    if (s.messages.length > MAX_MESSAGES) s.messages = s.messages.slice(-MAX_MESSAGES);
    s.lastAt = Date.now();
    await this.ctx.storage.put(`s:${id}`, s);
    return s;
  }

  /** Разговоры для админки, свежие сверху. */
  async list(limit = 200): Promise<Session[]> {
    const all = [...(await this.ctx.storage.list<Session>({ prefix: "s:" })).values()].filter((s) => s.messages.length);
    return all.sort((a, b) => b.lastAt - a.lastAt).slice(0, limit);
  }

  /** Менеджер открыл разговор: всё до последнего сообщения — прочитано. */
  async markSeen(id: string): Promise<void> {
    const s = await this.session(id);
    if (!s) return;
    s.seenAt = s.messages.at(-1)?.id ?? Date.now();
    await this.ctx.storage.put(`s:${id}`, s);
  }

  /** Менеджер взял разговор на себя — ассистент больше не отвечает. */
  async setManual(id: string): Promise<void> {
    const s = await this.session(id);
    if (!s || s.manual) return;
    s.manual = true;
    await this.ctx.storage.put(`s:${id}`, s);
  }

  async saveLead(lead: Lead): Promise<void> {
    await this.ctx.storage.put(`l:${lead.id}`, lead);
  }

  async setLeadDone(id: string, done: boolean): Promise<Lead | null> {
    const lead = (await this.ctx.storage.get<Lead>(`l:${id}`)) ?? null;
    if (!lead) return null;
    lead.done = done;
    await this.ctx.storage.put(`l:${id}`, lead);
    return lead;
  }

  /** Заявки, свежие сверху; ключ `l:<время>-<случайное>` — порядок уже по времени. */
  async leads(): Promise<Lead[]> {
    const all = [...(await this.ctx.storage.list<Lead>({ prefix: "l:" })).values()];
    return all.sort((a, b) => b.at - a.at).slice(0, MAX_LEADS);
  }

  async setContact(id: string, contact: string): Promise<void> {
    const s = await this.session(id);
    if (!s) return;
    s.contact = contact;
    await this.ctx.storage.put(`s:${id}`, s);
  }

  async markNotified(id: string): Promise<void> {
    const s = await this.session(id);
    if (!s) return;
    s.notified = true;
    await this.ctx.storage.put(`s:${id}`, s);
  }

  /** Не больше limit запросов в минуту с одного ключа. */
  async allow(key: string, limit: number): Promise<boolean> {
    const k = `r:${Math.floor(Date.now() / 60_000)}:${key}`;
    const n = ((await this.ctx.storage.get<number>(k)) ?? 0) + 1;
    await this.ctx.storage.put(k, n);
    if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(Date.now() + 3_600_000);
    return n <= limit;
  }

  /** Раз в час: старые счётчики частоты и сессии, молчащие дольше 30 дней. */
  async alarm(): Promise<void> {
    const minute = Math.floor(Date.now() / 60_000);
    const stale: string[] = [];
    for (const k of (await this.ctx.storage.list({ prefix: "r:" })).keys()) if (Number(k.split(":")[1]) < minute) stale.push(k);
    for (const [k, s] of await this.ctx.storage.list<Session>({ prefix: "s:" })) if (Date.now() - s.lastAt >= SESSION_TTL_MS) stale.push(k);
    for (let i = 0; i < stale.length; i += 128) await this.ctx.storage.delete(stale.slice(i, i + 128));
  }
}

/** Одна группа на заявки и чат; TELEGRAM_CHAT_GROUP_ID — прежнее имя того же секрета. */
const groupId = (env: ChatEnv) => env.TELEGRAM_ADMIN_CHAT_ID ?? env.TELEGRAM_CHAT_GROUP_ID;
export const store = (env: ChatEnv) => env.CHAT.get(env.CHAT.idFromName("onez"));
const json = (body: unknown, status = 200, headers: HeadersInit = {}) => Response.json(body, { status, headers });
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const readCookie = (request: Request) => request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([\\w-]+)`))?.[1];
const sessionCookie = (id: string) => `${COOKIE}=${id}; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; HttpOnly; Secure; SameSite=Lax`;
/** Посетителю — только текст и подпись, без служебных полей. */
const visible = (s: Session | null, since = 0) => (s?.messages ?? []).filter((m) => m.id > since).map(({ id, from, text, author }) => ({ id, from, text, author }));

/** Отправка в группу с кнопкой «ответить клиенту»; false — Telegram не принял. */
async function postToGroup(env: ChatEnv, text: string, contact: string): Promise<boolean> {
  const button = replyButton([{ label: "Телефон", value: contact }]);
  const resp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: groupId(env),
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(button && { reply_markup: { inline_keyboard: [[button]] } }),
    }),
    signal: AbortSignal.timeout(8000),
  }).catch((err) => {
    console.error("chat.notify fetch failed", err);
    return null;
  });
  if (resp?.ok) return true;
  console.error("chat.notify non-2xx", resp?.status, await resp?.text().catch(() => ""));
  return false;
}

/** Контакт появился: одна сводка в группу — контакт и суть разговора, не переписка целиком (закон 7). */
async function notifyTeam(env: ChatEnv, s: Session, contact: string): Promise<void> {
  const essence = s.messages
    .filter((m) => m.from === "visitor" && !isContactOnly(m.text))
    .slice(-5)
    .map((m) => `· ${escapeHtml(m.text)}`)
    .join("\n");
  const text = [
    `💬 <b>ONEZ</b> · чат оставил контакт`,
    `🕒 ${receivedAt()} (Тбилиси)`,
    "",
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    `🗣 Отвечать на языке: <b>${escapeHtml(replyLanguage(s.browserLang, s.lang))}</b>`,
    `Страница: ${escapeHtml(s.page)}`,
    ...(s.source ?? []),
    "",
    "<b>Суть обращения:</b>",
    essence || "—",
  ].join("\n");
  if (await postToGroup(env, text, contact)) await store(env).markNotified(s.id);
}

/** Контакт уже есть — каждое новое сообщение посетителя доходит до менеджера. */
async function forwardMessage(env: ChatEnv, s: Session, contact: string, message: string): Promise<void> {
  const text = [`💬 <b>ONEZ</b> · чат, ${escapeHtml(contact)}`, `🕒 ${receivedAt()} (Тбилиси)`, "", escapeHtml(message)].join("\n");
  await postToGroup(env, text, contact);
}

/** Сообщение из поля «телефон» окна чата — сам контакт, а не вопрос. */
const isContactOnly = (text: string) => /^📞\s*\S+$/.test(text.trim());

async function assistantReply(env: ChatEnv, id: string): Promise<void> {
  const s = await store(env).session(id);
  // Менеджер уже в разговоре — два голоса в одном чате только запутают посетителя.
  if (!s || s.manual) return;
  const run = env.AI.run.bind(env.AI) as (model: string, input: object) => Promise<{ response?: string }>;
  let reply = "";
  try {
    const out = await run(MODEL, {
      messages: [
        { role: "system", content: chatSystemPrompt(replyLanguage(s.browserLang, s.lang)) },
        ...s.messages.slice(-HISTORY_TURNS).map((m) => ({ role: m.from === "visitor" ? "user" : "assistant", content: m.text })),
      ],
      max_tokens: 220,
      temperature: 0.3,
    });
    reply = out.response?.trim().slice(0, 700) ?? "";
  } catch (err) {
    console.error("chat.ai failed", err);
    return;
  }
  if (reply) await store(env).append(id, { from: "agent", text: reply, author: ASSISTANT });
}

async function send(request: Request, env: ChatEnv, ctx: ExecutionContext, ip: string): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ error: "forbidden" }, 403);
  if (!(await store(env).allow(`send:${ip}`, 10))) return json({ error: "rate_limited" }, 429);

  const body = await request.json<Record<string, unknown>>().catch(() => null);
  const text = str(body?.text, MAX_TEXT);
  if (!text) return json({ error: "empty" }, 400);

  const cookieId = readCookie(request);
  const existing = cookieId ? await store(env).session(cookieId) : null;
  const session = existing ?? (await store(env).create({ page: str(body?.page, 300) || "/", lang: str(body?.lang, 5) || "ka", browserLang: str(body?.browserLang, 100), source: sourceLines(body?.attribution) }));
  const saved = (await store(env).append(session.id, { from: "visitor", text })) ?? session;

  // Без контакта в группу ничего не уходит. Нашёлся впервые — сводка; уже есть — пересылаем сообщение.
  if (saved.contact) {
    if (!isContactOnly(text)) ctx.waitUntil(forwardMessage(env, saved, saved.contact, text));
  } else {
    const contact = extractContact(text);
    if (contact) {
      await store(env).setContact(saved.id, contact);
      ctx.waitUntil(notifyTeam(env, { ...saved, contact }, contact));
    }
  }

  ctx.waitUntil(assistantReply(env, saved.id));
  const hasContact = Boolean(saved.contact) || Boolean(extractContact(text));
  return json({ messages: visible(saved), hasContact }, 200, existing ? {} : { "set-cookie": sessionCookie(saved.id) });
}

/** /api/chat/send, /api/chat/poll. */
export async function handleChat(request: Request, env: ChatEnv, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const ip = request.headers.get("cf-connecting-ip") ?? "local";

  if (url.pathname === "/api/chat/poll" && request.method === "GET") {
    if (!(await store(env).allow(`poll:${ip}`, 40))) return json({ messages: [] }, 429);
    const id = readCookie(request);
    const s = id ? await store(env).session(id) : null;
    return json({ messages: visible(s, Number(url.searchParams.get("since") ?? 0)), hasContact: Boolean(s?.contact) });
  }
  if (url.pathname === "/api/chat/send" && request.method === "POST") {
    if (!env.TELEGRAM_BOT_TOKEN || !groupId(env)) return json({ error: "not_configured" }, 503);
    return send(request, env, ctx, ip);
  }
  return json({ error: "not_found" }, 404);
}
