// Раздел «Тексты» админки: менеджер правит строки сайта (ru/ka/en), воркер коммитит
// файл правок app/i18n/overrides.json в GitHub через API, Cloudflare пересобирает сайт.
// Токен GitHub — секрет воркера GITHUB_TOKEN (fine-grained, право «Contents: Read and write»
// только на этот репозиторий); в ответы и ошибки он не попадает. Вход по куке админки
// проверяет workers/admin.ts, сюда запрос доходит уже авторизованным.
//
// Источник правды для админки — файл в GitHub, а не сборка воркера: пока Cloudflare
// собирает сайт после публикации, сборка ещё старая, и по ней менеджер увидел бы
// прежние тексты. Поэтому GET /texts читает файл из GitHub, а `pending` сообщает, что
// правки уже в репозитории, но на сайт ещё не доехали.
import { PAGE_META } from "~/content/pages/meta";
import bundled from "~/i18n/overrides.json";
import en from "~/i18n/en.json";
import extra from "~/i18n/extra.json";
import ka from "~/i18n/ka.json";
import pages from "~/i18n/pages.json";
import { TEXT_LANGS, emptyOverrides, mergeOverrides, parseOverrides, sameOverrides, serializeOverrides, type Changes, type Overrides, type TextLang } from "~/lib/texts-check";

export type TextsEnv = {
  /** Секрет: fine-grained токен GitHub. */
  GITHUB_TOKEN?: string;
  /** «владелец/репозиторий»; по умолчанию onezashvilebi/onez. */
  GITHUB_REPO?: string;
  /** Ветка для коммитов правок; по умолчанию — ветка, из которой собран сайт (иначе main). */
  GITHUB_BRANCH?: string;
  GITHUB_OVERRIDES_PATH?: string;
};

type Cfg = { token: string; repo: string; branch: string; path: string };

/**
 * Ветка, из которой собран этот сайт: её подставляет сборка (vite.config.ts, переменная
 * WORKERS_CI_BRANCH из Workers Builds). Правки пишутся в неё же: так сайт, собранный из ветки,
 * всегда пересобирается своими правками. Свою ветку можно задать переменной GITHUB_BRANCH.
 */
declare const __BUILD_BRANCH__: string | undefined;
const BUILD_BRANCH = typeof __BUILD_BRANCH__ === "string" ? __BUILD_BRANCH__ : "";
type Item = [key: string, ka: string, en: string, pages: number];
type Group = { id: string; name: string; sub: string; ids: number[] };

const DEFAULT_REPO = "onezashvilebi/onez";
const DEFAULT_BRANCH = "main";
const DEFAULT_PATH = "app/i18n/overrides.json";
const COMMON_SHARE = 0.8;
const MAX_FILE_BYTES = 900_000;
const HISTORY_LIMIT = 20;

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

/** Сообщения для менеджера: по-русски, без технических подробностей и без токена. */
const MESSAGES: Record<string, string> = {
  not_configured: "Не задан секрет GITHUB_TOKEN у воркера. Тексты можно смотреть, но публиковать пока нельзя.",
  bad_token: "GitHub не принял токен: он неверный или просрочен. Создайте новый и обновите секрет GITHUB_TOKEN.",
  forbidden: "GitHub отказал в доступе. У токена должно быть право «Contents: Read and write» на этот репозиторий; возможно, превышен лимит запросов.",
  not_found: "GitHub не нашёл репозиторий или ветку. Проверьте GITHUB_REPO, GITHUB_BRANCH и доступ токена к репозиторию.",
  conflict: "Файл правок в GitHub изменился, пока вы работали. Данные перечитаны: проверьте правки и опубликуйте ещё раз.",
  overrides_invalid: "Файл правок в GitHub повреждён или записан не по формату. Исправьте его вручную в репозитории.",
  too_big: "Файл правок стал слишком большим для публикации из админки.",
  network: "Не удалось связаться с GitHub. Повторите через минуту.",
  bad_request: "Запрос составлен неверно.",
  invalid: "Есть ошибки в текстах. Исправьте отмеченные поля.",
};
const fail = (code: string, status: number, extraBody: Record<string, unknown> = {}) => json({ error: code, message: MESSAGES[code] ?? MESSAGES.network, ...extraBody }, status);

class GitHubError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

function config(env: TextsEnv): Cfg | null {
  if (!env.GITHUB_TOKEN) return null;
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  const branch = env.GITHUB_BRANCH || BUILD_BRANCH || DEFAULT_BRANCH;
  const path = env.GITHUB_OVERRIDES_PATH || DEFAULT_PATH;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo) || !/^[\w./-]+$/.test(branch) || !/^[\w./-]+$/.test(path) || path.includes("..")) return null;
  return { token: env.GITHUB_TOKEN, repo, branch, path };
}

const encodePath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

async function github(cfg: Cfg, endpoint: string, init: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(`https://api.github.com/repos/${cfg.repo}/${endpoint}`, {
      ...init,
      signal: AbortSignal.timeout(15_000),
      headers: {
        authorization: `Bearer ${cfg.token}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "onez-admin",
        ...(init.body ? { "content-type": "application/json" } : {}),
      },
    });
  } catch {
    throw new GitHubError("network", 502);
  }
}

function explain(resp: Response): GitHubError {
  if (resp.status === 401) return new GitHubError("bad_token", 502);
  if (resp.status === 403 || resp.status === 429) return new GitHubError("forbidden", 502);
  if (resp.status === 404) return new GitHubError("not_found", 502);
  if (resp.status === 409 || resp.status === 422) return new GitHubError("conflict", 409);
  return new GitHubError("network", 502);
}

function fromBase64(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** Файл правок на ветке или коммите. Нет файла — text: null (первая публикация его создаст). */
async function readFile(cfg: Cfg, ref: string): Promise<{ text: string | null; sha: string | null }> {
  const resp = await github(cfg, `contents/${encodePath(cfg.path)}?ref=${encodeURIComponent(ref)}`);
  if (resp.status === 404) {
    // 404 бывает и у несуществующей ветки: отличаем, спросив про саму ветку.
    const branch = await github(cfg, `branches/${encodeURIComponent(ref)}`);
    if (branch.status === 404) throw new GitHubError("not_found", 502);
    return { text: null, sha: null };
  }
  if (!resp.ok) throw explain(resp);
  const body = (await resp.json()) as { content?: unknown; encoding?: unknown; sha?: unknown };
  if (body.encoding !== "base64" || typeof body.content !== "string" || typeof body.sha !== "string") throw new GitHubError("too_big", 502);
  return { text: fromBase64(body.content), sha: body.sha };
}

async function writeFile(cfg: Cfg, text: string, sha: string | null, message: string): Promise<{ sha: string; commit: string }> {
  const resp = await github(cfg, `contents/${encodePath(cfg.path)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: toBase64(text), branch: cfg.branch, ...(sha ? { sha } : {}) }),
  });
  if (!resp.ok) throw explain(resp);
  const body = (await resp.json()) as { content?: { sha?: string }; commit?: { sha?: string } };
  return { sha: body.content?.sha ?? "", commit: body.commit?.sha ?? "" };
}

function current(file: { text: string | null }): Overrides {
  return file.text === null ? emptyOverrides() : parseOverrides(file.text);
}

// ---- Каталог строк: страницы и тексты из словарей сборки ----

const kaBase = (key: string) => (extra.ka as Record<string, string>)[key] ?? (ka as Record<string, string>)[key] ?? "";
const enBase = (key: string) => (extra.en as Record<string, string>)[key] ?? (en as Record<string, string>)[key] ?? "";
const baseOf = (lang: TextLang, key: string) => (lang === "ru" ? key : lang === "ka" ? kaBase(key) : enBase(key));

let catalogCache: { groups: Group[]; items: Item[]; known: Set<string> } | undefined;

/** Страницы из app/i18n/pages.json; строки, что есть почти на каждой странице (формы, чат, баннер), — отдельной группой. */
function catalog() {
  if (catalogCache) return catalogCache;
  const map = pages as Record<string, string[]>;
  // Админка — служебная страница, только по-русски: её строки в «Тексты» не нужны.
  const slugs = Object.keys(map).filter((s) => s !== "admin");
  const spread = new Map<string, number>();
  for (const slug of slugs) for (const key of new Set(map[slug] ?? [])) spread.set(key, (spread.get(key) ?? 0) + 1);

  const items: Item[] = [];
  const index = new Map<string, number>();
  const idOf = (key: string) => {
    let i = index.get(key);
    if (i === undefined) {
      i = items.push([key, kaBase(key), enBase(key), spread.get(key) ?? 1]) - 1;
      index.set(key, i);
    }
    return i;
  };

  const limit = Math.ceil(slugs.length * COMMON_SHARE);
  const isCommon = (key: string) => (spread.get(key) ?? 0) >= limit;
  const common = [...spread.keys()].filter(isCommon);
  const groups: Group[] = [{ id: "__common", name: "Общие строки", sub: "формы, чат, баннер, подвал: есть почти на всех страницах", ids: common.map(idOf) }];
  for (const slug of slugs) {
    const ids = [...new Set(map[slug] ?? [])].filter((key) => !isCommon(key)).map(idOf);
    const title = PAGE_META[slug]?.[0];
    groups.push({ id: slug === "" ? "__home" : slug, name: slug === "" ? "Главная" : (title ?? `/${slug}`), sub: slug === "" ? "/" : `/${slug}`, ids });
  }
  catalogCache = { groups, items, known: new Set(items.map((i) => i[0])) };
  return catalogCache;
}

// ---- Обработчики ----

const bundledOverrides = (): Overrides => ({ ...emptyOverrides(), ...(bundled as unknown as Partial<Overrides>) });

async function handleList(env: TextsEnv): Promise<Response> {
  const { groups, items } = catalog();
  const cfg = config(env);
  const live = bundledOverrides();
  const base = { groups, items };
  if (!cfg) return json({ ...base, configured: false, github: { ok: false, error: "not_configured", message: MESSAGES.not_configured, repo: env.GITHUB_REPO || DEFAULT_REPO, branch: env.GITHUB_BRANCH || BUILD_BRANCH || DEFAULT_BRANCH, buildBranch: BUILD_BRANCH }, overrides: live, sha: null, pending: false });
  const where = { repo: cfg.repo, branch: cfg.branch, buildBranch: BUILD_BRANCH };
  try {
    const file = await readFile(cfg, cfg.branch);
    const overrides = current(file);
    return json({ ...base, configured: true, github: { ok: true, ...where }, overrides, sha: file.sha, pending: !sameOverrides(live, overrides) });
  } catch (e) {
    const code = e instanceof GitHubError ? e.code : e instanceof Error && e.message === "overrides_invalid" ? "overrides_invalid" : "network";
    return json({ ...base, configured: true, github: { ok: false, error: code, message: MESSAGES[code], ...where }, overrides: live, sha: null, pending: false });
  }
}

async function handlePublish(request: Request, env: TextsEnv): Promise<Response> {
  const cfg = config(env);
  if (!cfg) return fail("not_configured", 503);
  const body = await request.json<Record<string, unknown>>().catch(() => null);
  const changes = body?.changes;
  const baseSha = body?.baseSha ?? null;
  if (!changes || typeof changes !== "object" || Array.isArray(changes) || (baseSha !== null && typeof baseSha !== "string")) return fail("bad_request", 400);
  try {
    const file = await readFile(cfg, cfg.branch);
    // Файл в GitHub уже не тот, что видел менеджер: чужие правки не затираем.
    if (file.sha !== baseSha) return fail("conflict", 409);
    const { known } = catalog();
    const merged = mergeOverrides(current(file), changes as Changes, { known: (key) => known.has(key), base: baseOf });
    if (merged.errors.length) return fail("invalid", 422, { issues: merged.errors });
    if (merged.changed === 0) return json({ ok: true, unchanged: true });
    const text = serializeOverrides(merged.next);
    if (text.length > MAX_FILE_BYTES) return fail("too_big", 413);
    const parts = TEXT_LANGS.filter((l) => merged.perLang[l]).map((l) => `${l} ${merged.perLang[l]}`).join(", ");
    const saved = await writeFile(cfg, text, file.sha, `Тексты: ${merged.changed} правок из админки (${parts})`);
    return json({ ok: true, changed: merged.changed, sha: saved.sha, commit: saved.commit, overrides: merged.next, warnings: merged.warnings });
  } catch (e) {
    if (e instanceof GitHubError) return fail(e.code, e.status);
    if (e instanceof Error && e.message === "overrides_invalid") return fail("overrides_invalid", 422);
    return fail("network", 502);
  }
}

async function handleHistory(env: TextsEnv): Promise<Response> {
  const cfg = config(env);
  if (!cfg) return fail("not_configured", 503);
  try {
    const resp = await github(cfg, `commits?sha=${encodeURIComponent(cfg.branch)}&path=${encodeURIComponent(cfg.path)}&per_page=${HISTORY_LIMIT}`);
    if (!resp.ok) throw explain(resp);
    const list = (await resp.json()) as { sha: string; commit: { message: string; author?: { name?: string; date?: string } } }[];
    return json({ commits: list.map((c) => ({ sha: c.sha, date: c.commit.author?.date ?? "", author: c.commit.author?.name ?? "", message: c.commit.message.split("\n")[0]?.slice(0, 140) ?? "" })) });
  } catch (e) {
    return e instanceof GitHubError ? fail(e.code, e.status) : fail("network", 502);
  }
}

/** Откат — новый коммит со старым содержимым файла: история остаётся целой, откат можно откатить. */
async function handleRollback(request: Request, env: TextsEnv): Promise<Response> {
  const cfg = config(env);
  if (!cfg) return fail("not_configured", 503);
  const body = await request.json<Record<string, unknown>>().catch(() => null);
  const sha = body?.sha;
  const baseSha = body?.baseSha ?? null;
  if (typeof sha !== "string" || !/^[0-9a-f]{7,40}$/.test(sha) || (baseSha !== null && typeof baseSha !== "string")) return fail("bad_request", 400);
  try {
    const old = await readFile(cfg, sha);
    // Откат к состоянию «файла ещё не было» — пустые правки.
    const target = current(old);
    const now = await readFile(cfg, cfg.branch);
    if (now.sha !== baseSha) return fail("conflict", 409);
    const text = serializeOverrides(target);
    const saved = await writeFile(cfg, text, now.sha, `Тексты: откат к версии ${sha.slice(0, 7)}`);
    return json({ ok: true, sha: saved.sha, commit: saved.commit });
  } catch (e) {
    if (e instanceof GitHubError) return fail(e.code, e.status);
    if (e instanceof Error && e.message === "overrides_invalid") return fail("overrides_invalid", 422);
    return fail("network", 502);
  }
}

/** /api/admin/texts*: null — это не наш адрес. */
export async function handleTextsAdmin(request: Request, env: TextsEnv, path: string): Promise<Response | null> {
  if (path !== "/texts" && !path.startsWith("/texts/")) return null;
  const get = request.method === "GET";
  const post = request.method === "POST";
  if (path === "/texts" && get) return handleList(env);
  if (path === "/texts/history" && get) return handleHistory(env);
  if (path === "/texts/publish" && post) return handlePublish(request, env);
  if (path === "/texts/rollback" && post) return handleRollback(request, env);
  return json({ error: "not_found" }, 404);
}
