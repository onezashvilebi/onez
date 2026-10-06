// Админка сайта (/admin): менеджер читает разговоры онлайн-чата, отвечает
// посетителю прямо в его окно и видит заявки с формы. Данные — в том же
// Durable Object ChatStore, что и чат. Вход один, по паролю из секрета
// ADMIN_PASSWORD; сессия — подписанная HMAC-кука, без базы пользователей.
import { SESSION_TTL_S, issueToken, samePassword, summary, verifyToken } from "./admin-auth";
import { type ChatEnv, type Lead, store } from "./chat";

export type AdminEnv = ChatEnv & { ADMIN_PASSWORD?: string };

const COOKIE = "onez_admin";
/** Попыток входа в минуту с одного адреса. */
const LOGIN_LIMIT = 5;
/** Подпись менеджера в окне посетителя (переводится словарём, как подпись ассистента). */
export const MANAGER = "Менеджер ONEZ";
const MAX_REPLY = 2000;

const json = (body: unknown, status = 200, headers: HeadersInit = {}) => Response.json(body, { status, headers });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const readCookie = (request: Request) => request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([\\w.-]+)`))?.[1];
const cookie = (value: string, maxAge: number) => `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;

/** /api/admin/* — всё, кроме входа, требует куки. */
export async function handleAdmin(request: Request, env: AdminEnv): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/admin/, "") || "/";
  const secret = env.ADMIN_PASSWORD;
  if (!secret) return json({ error: "not_configured" }, 503);

  // Запросы только со своей страницы: чужой сайт не сможет ни войти, ни ответить от имени менеджера.
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && (!origin || new URL(origin).host !== url.host)) return json({ error: "forbidden" }, 403);

  if (path === "/login" && request.method === "POST") {
    const ip = request.headers.get("cf-connecting-ip") ?? "local";
    if (!(await store(env).allow(`admin-login:${ip}`, LOGIN_LIMIT))) return json({ error: "rate_limited" }, 429);
    const body = await request.json<Record<string, unknown>>().catch(() => null);
    if (!samePassword(str(body?.password, 200), secret)) return json({ error: "wrong_password" }, 401);
    return json({ ok: true }, 200, { "set-cookie": cookie(await issueToken(secret), SESSION_TTL_S) });
  }
  if (path === "/logout" && request.method === "POST") return json({ ok: true }, 200, { "set-cookie": cookie("", 0) });

  if (!(await verifyToken(secret, readCookie(request)))) return json({ error: "unauthorized" }, 401);

  if (path === "/me" && request.method === "GET") return json({ ok: true });

  if (path === "/chats" && request.method === "GET") {
    const sessions = await store(env).list();
    return json({ chats: sessions.map(summary) });
  }

  const chat = path.match(/^\/chats\/([\w-]+)(\/reply|\/seen)?$/);
  if (chat) {
    const [, id, action] = chat;
    if (!action && request.method === "GET") {
      const s = await store(env).session(id);
      if (!s) return json({ error: "not_found" }, 404);
      return json({ chat: summary(s), messages: s.messages, browserLang: s.browserLang });
    }
    if (action === "/seen" && request.method === "POST") {
      await store(env).markSeen(id);
      return json({ ok: true });
    }
    if (action === "/reply" && request.method === "POST") {
      const body = await request.json<Record<string, unknown>>().catch(() => null);
      const text = str(body?.text, MAX_REPLY);
      if (!text) return json({ error: "empty" }, 400);
      // Сначала «ручной режим», потом сообщение: ассистент, уже готовящий ответ, увидит флаг.
      await store(env).setManual(id);
      const s = await store(env).append(id, { from: "agent", text, author: MANAGER });
      if (!s) return json({ error: "not_found" }, 404);
      await store(env).markSeen(id);
      return json({ messages: s.messages });
    }
  }

  if (path === "/leads" && request.method === "GET") return json({ leads: await store(env).leads() });
  const lead = path.match(/^\/leads\/([\w-]+)\/done$/);
  if (lead && request.method === "POST") {
    const body = await request.json<Record<string, unknown>>().catch(() => null);
    const updated: Lead | null = await store(env).setLeadDone(lead[1], body?.done !== false);
    return updated ? json({ lead: updated }) : json({ error: "not_found" }, 404);
  }

  return json({ error: "not_found" }, 404);
}
