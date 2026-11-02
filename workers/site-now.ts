// Фото блока «Сейчас строим»: менеджер загружает их в админке (раздел «Фото стройки»),
// сайт показывает каруселью. Файлы и подписи лежат в том же Durable Object ChatStore
// (ключи pm:/pb:), отдельного хранилища заводить не нужно. Публичные адреса —
// /api/site-now*, управление — /api/admin/site-now* (вход по куке админки проверяет admin.ts).
import { type ChatEnv, store } from "./chat";

export type SitePhoto = {
  id: string;
  at: number;
  /** День съёмки, ГГГГ-ММ-ДД: показывается рядом с подписью, по нему же порядок (свежие первыми). */
  date: string;
  /** Подпись на трёх языках; если нужной нет, сайт берёт русскую. */
  caption: { ru: string; ka: string; en: string };
  type: string;
  size: number;
};

const MAX_PHOTOS = 60;
/** Браузер сжимает кадр до 100–300 КБ; граница — с запасом под лимит значения в Durable Object (2 МБ). */
const MAX_BYTES = 1_000_000;
const MAX_CAPTION = 120;
const TYPES = ["image/webp", "image/jpeg", "image/png"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const json = (body: unknown, status = 200, headers: HeadersInit = {}) => Response.json(body, { status, headers });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const captions = (get: (lang: "ru" | "ka" | "en") => unknown) => ({ ru: str(get("ru"), MAX_CAPTION), ka: str(get("ka"), MAX_CAPTION), en: str(get("en"), MAX_CAPTION) });
const publicPhoto = (p: SitePhoto) => ({ id: p.id, date: p.date, caption: p.caption, src: `/api/site-now/photo/${p.id}?v=${p.at}` });

/** /api/site-now — список для сайта и сами файлы; без входа, только чтение. */
export async function handleSiteNow(request: Request, env: ChatEnv): Promise<Response> {
  if (request.method !== "GET") return json({ error: "method_not_allowed" }, 405);
  const path = new URL(request.url).pathname.replace(/^\/api\/site-now/, "") || "/";

  if (path === "/") {
    const photos = await store(env).photoList();
    return json({ photos: photos.map(publicPhoto) }, 200, { "cache-control": "public, max-age=60" });
  }
  const file = path.match(/^\/photo\/([\w-]+)$/);
  if (file) {
    const found = await store(env).photoGet(file[1]);
    if (!found) return json({ error: "not_found" }, 404);
    // Содержимое под своим id не меняется — кэш на год.
    return new Response(found.data, { headers: { "content-type": found.meta.type, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
  }
  return json({ error: "not_found" }, 404);
}

/** /api/admin/site-now* — добавить, поправить подпись и дату, удалить. null — это не наш адрес. */
export async function handleSiteNowAdmin(request: Request, env: ChatEnv, path: string): Promise<Response | null> {
  if (path !== "/site-now" && !path.startsWith("/site-now/")) return null;
  const db = store(env);
  const id = path.match(/^\/site-now\/([\w-]+)$/)?.[1];

  if (path === "/site-now" && request.method === "GET") return json({ photos: (await db.photoList()).map(publicPhoto) });

  if (path === "/site-now" && request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!form || !(file instanceof File)) return json({ error: "no_file" }, 400);
    if (!TYPES.includes(file.type)) return json({ error: "bad_type" }, 415);
    if (file.size === 0 || file.size > MAX_BYTES) return json({ error: "too_big" }, 413);
    const date = str(form.get("date"), 10);
    if (!DATE.test(date)) return json({ error: "bad_date" }, 400);
    const caption = captions((lang) => form.get(lang));
    if (!caption.ru && !caption.ka && !caption.en) return json({ error: "no_caption" }, 400);
    if ((await db.photoList()).length >= MAX_PHOTOS) return json({ error: "limit" }, 409);
    const photo: SitePhoto = { id: crypto.randomUUID().replace(/-/g, ""), at: Date.now(), date, caption, type: file.type, size: file.size };
    await db.photoAdd(photo, await file.arrayBuffer());
    return json({ photo: publicPhoto(photo) }, 201);
  }

  if (id && request.method === "PATCH") {
    const body = await request.json<Record<string, unknown>>().catch(() => null);
    const date = str(body?.date, 10);
    const caption = captions((lang) => body?.[lang]);
    if (!DATE.test(date) || (!caption.ru && !caption.ka && !caption.en)) return json({ error: "bad_request" }, 400);
    const photo = await db.photoUpdate(id, { date, caption });
    return photo ? json({ photo: publicPhoto(photo) }) : json({ error: "not_found" }, 404);
  }

  if (id && request.method === "DELETE") {
    await db.photoDelete(id);
    return json({ ok: true });
  }
  return json({ error: "not_found" }, 404);
}
