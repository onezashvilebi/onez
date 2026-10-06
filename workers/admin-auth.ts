// Чистые функции админки без привязки к Cloudflare: подпись токена, сравнение
// пароля, сводка разговора. Отдельный файл — чтобы их можно было тестировать
// без среды воркера (workers/chat.ts тянет cloudflare:workers).
import type { Session } from "./chat";

export const SESSION_TTL_S = 30 * 24 * 3600;
const encoder = new TextEncoder();

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/** Токен «срок.подпись»: проверяется без хранилища, живёт до срока или до смены пароля. */
export async function issueToken(secret: string, now = Date.now()): Promise<string> {
  const exp = String(Math.floor(now / 1000) + SESSION_TTL_S);
  return `${exp}.${await hmac(secret, exp)}`;
}

/** Сравнение без ранней остановки — время ответа не выдаёт совпавший префикс. */
function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyToken(secret: string, token: string | undefined, now = Date.now()): Promise<boolean> {
  const parts = (token ?? "").split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  if (!exp || !sig || Number(exp) * 1000 < now) return false;
  return sameString(await hmac(secret, exp), sig);
}

export const samePassword = sameString;

/** Разговор для списка: без переписки, с последней репликой и числом непрочитанных. */
export function summary(s: Session) {
  const last = s.messages.at(-1);
  const unread = s.messages.filter((m) => m.from === "visitor" && m.id > (s.seenAt ?? 0)).length;
  return { id: s.id, page: s.page, lang: s.lang, lastAt: s.lastAt, contact: s.contact ?? null, manual: Boolean(s.manual), unread, last: last ? { from: last.from, text: last.text.slice(0, 120), at: last.at } : null, source: s.source ?? [] };
}
