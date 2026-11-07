import { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { BUTTON, CARD, FIELD, GHOST, LABEL, fmtTime } from "~/components/admin/AdminShell";
import { cn } from "~/lib/cn";
import { TEXT_LANGS, checkText, type Changes, type Overrides, type TextCheck, type TextLang } from "~/lib/texts-check";

// Раздел «Тексты»: менеджер правит строки сайта на трёх языках и публикует их одним
// коммитом в GitHub (workers/texts.ts). Ключ строки — русский текст из кода, он не
// меняется: правка русского — это замена того, что видит посетитель. Сайт обновляется
// после пересборки в Cloudflare (пара минут).

type Item = readonly [key: string, ka: string, en: string, pages: number];
type Group = { id: string; name: string; sub: string; ids: number[] };
type Github = { ok: boolean; error?: string; message?: string; repo: string; branch: string; buildBranch?: string };
type Data = { configured: boolean; github: Github; groups: Group[]; items: Item[]; overrides: Overrides; sha: string | null; pending: boolean };
type Commit = { sha: string; date: string; message: string; author: string };
type Issue = { lang: TextLang; key: string; message: string };
/** Правки менеджера, ещё не опубликованные: «язык:номер строки» → новый текст (null — к исходному). */
type Edits = Record<string, string | null>;
type Notice = { kind: "ok" | "error"; text: string } | null;

const LANG_NAME: Record<TextLang, string> = { ru: "Русский", ka: "Грузинский", en: "Английский" };
const PAGE_SIZE = 40;
const SEARCH_LIMIT = 60;
const NET_ERROR = "Не удалось выполнить запрос. Проверьте связь и обновите страницу.";

const baseOf = (item: Item, lang: TextLang) => (lang === "ru" ? item[0] : lang === "ka" ? item[1] : item[2]);
const editKey = (lang: TextLang, idx: number) => `${lang}:${idx}`;

async function call<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T & { error?: string; message?: string } }> {
  const resp = await fetch(`/api/admin/texts${path}`, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
  if (resp.status === 401) throw new Error("Сессия закончилась. Обновите страницу и войдите заново.");
  const body = (await resp.json().catch(() => ({}))) as T & { error?: string; message?: string };
  return { status: resp.status, body };
}
const messageOf = (e: unknown) => (e instanceof Error && /[А-Яа-яЁё]/.test(e.message) ? e.message : NET_ERROR);

// ---- Строка: три поля ----

type FieldView = { value: string; changed: boolean; published: boolean; missing: boolean; edited: boolean; errors: string[]; warnings: string[] };
type RowProps = { idx: number; sig: string; keyText: string; pages: number; fields: Record<TextLang, FieldView>; onEdit: (idx: number, lang: TextLang, text: string) => void; onReset: (idx: number, lang: TextLang) => void; onUndo: (idx: number, lang: TextLang) => void };

const Row = memo(
  function Row({ idx, keyText, pages, fields, onEdit, onReset, onUndo }: RowProps) {
    return (
      <div className={cn(CARD, "flex flex-col gap-3 p-4")}>
        {pages > 1 && <p className="text-[11px] text-faint">Эта строка есть ещё на {pages - 1} стр.: правка изменит её везде.</p>}
        <div className="grid gap-3 lg:grid-cols-3">
          {TEXT_LANGS.map((lang) => {
            const f = fields[lang];
            return (
              <div key={lang} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={LABEL}>{LANG_NAME[lang]}</span>
                  {f.changed && <span className="rounded-[1px] bg-teal px-1.5 py-0.5 text-[10px] font-bold text-ink uppercase">изменено</span>}
                  {!f.changed && f.published && <span className="rounded-[1px] border border-line px-1.5 py-0.5 text-[10px] font-bold text-teal uppercase">правка</span>}
                  {f.missing && <span className="rounded-[1px] bg-copper px-1.5 py-0.5 text-[10px] font-bold text-paper uppercase">нет перевода</span>}
                </div>
                <textarea
                  value={f.value}
                  rows={Math.min(9, Math.max(2, Math.ceil(f.value.length / 36)))}
                  onChange={(e) => onEdit(idx, lang, e.target.value)}
                  spellCheck={lang !== "ka"}
                  lang={lang}
                  aria-label={`${LANG_NAME[lang]}: ${keyText.slice(0, 60)}`}
                  className={cn(FIELD, "w-full resize-y leading-relaxed", f.errors.length ? "ring-1 ring-error" : f.changed ? "ring-1 ring-teal" : "")}
                />
                {f.errors.map((m) => (
                  <p key={m} className="text-[12px] text-error">{m}</p>
                ))}
                {f.warnings.map((m) => (
                  <p key={m} className="text-[12px] text-copper-light">{m}</p>
                ))}
                {(f.changed || f.published) && (
                  <div className="flex gap-3 text-[11px] font-bold tracking-[.06em] uppercase">
                    {f.changed && (
                      <button type="button" onClick={() => onUndo(idx, lang)} className="text-muted transition-colors hover:text-teal">
                        Отменить
                      </button>
                    )}
                    <button type="button" onClick={() => onReset(idx, lang)} className="text-muted transition-colors hover:text-teal">
                      К исходному
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  (a, b) => a.idx === b.idx && a.sig === b.sig,
);

// ---- История и откат ----

function History({ sha, dirty, onRolled, setNotice }: { sha: string | null; dirty: boolean; onRolled: () => void; setNotice: (n: Notice) => void }) {
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    call<{ commits: Commit[] }>("/history")
      .then((r) => {
        if (cancelled) return;
        if (r.status === 200) setCommits(r.body.commits);
        else setError(r.body.message ?? NET_ERROR);
      })
      .catch((e) => !cancelled && setError(messageOf(e)));
    return () => {
      cancelled = true;
    };
  }, [sha]);

  const rollback = async (c: Commit) => {
    if (dirty) return setNotice({ kind: "error", text: "Сначала опубликуйте или отмените несохранённые правки: после отката они бы потерялись." });
    if (!window.confirm(`Вернуть тексты к версии от ${fmtTime(Date.parse(c.date))}? Это создаст новый коммит, историю можно будет откатить обратно.`)) return;
    setBusy(true);
    try {
      const r = await call<{ ok?: boolean }>("/rollback", { method: "POST", body: JSON.stringify({ sha: c.sha, baseSha: sha }) });
      if (r.status === 200) {
        setNotice({ kind: "ok", text: "Откат отправлен в GitHub. Сайт вернётся к той версии после пересборки (пара минут)." });
        onRolled();
      } else setNotice({ kind: "error", text: r.body.message ?? NET_ERROR });
    } catch (e) {
      setNotice({ kind: "error", text: messageOf(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn(CARD, "flex flex-col gap-2 p-4")}>
      <div className={LABEL}>Последние публикации</div>
      {error && <p className="text-sm text-error">{error}</p>}
      {!error && !commits && <p className="text-sm text-muted">Загружаю…</p>}
      {commits?.length === 0 && <p className="text-sm text-muted">Публикаций пока не было.</p>}
      {commits?.map((c, i) => (
        <div key={c.sha} className="flex flex-wrap items-center gap-3 border-t border-line py-2 text-sm first:border-t-0">
          <span className="w-28 shrink-0 text-muted">{c.date ? fmtTime(Date.parse(c.date)) : ""}</span>
          <span className="min-w-0 flex-1 truncate">{c.message}</span>
          <span className="text-[11px] text-faint">{c.sha.slice(0, 7)}</span>
          {i === 0 ? (
            <span className="text-[11px] font-bold tracking-[.06em] text-teal uppercase">последняя</span>
          ) : (
            <button type="button" disabled={busy} onClick={() => rollback(c)} className={GHOST}>
              Вернуть
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- Раздел ----

export function AdminTexts() {
  const [data, setData] = useState<Data | null>(null);
  const [loadError, setLoadError] = useState("");
  const [edits, setEdits] = useState<Edits>({});
  const [groupId, setGroupId] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const search = useDeferredValue(query.trim().toLowerCase());

  const load = useCallback(async () => {
    try {
      const r = await call<Data>("");
      if (r.status !== 200) throw new Error(NET_ERROR);
      setData(r.body);
      setLoadError("");
      setGroupId((cur) => cur || r.body.groups[0]?.id || "");
    } catch (e) {
      setLoadError(messageOf(e));
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  // Несохранённые правки: браузер переспросит перед закрытием вкладки.
  const hasEdits = Object.keys(edits).length > 0;
  useEffect(() => {
    if (!hasEdits) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasEdits]);

  const onEdit = useCallback((idx: number, lang: TextLang, text: string) => setEdits((cur) => ({ ...cur, [editKey(lang, idx)]: text })), []);
  const onReset = useCallback((idx: number, lang: TextLang) => setEdits((cur) => ({ ...cur, [editKey(lang, idx)]: null })), []);
  const onUndo = useCallback((idx: number, lang: TextLang) => {
    setEdits((cur) => {
      const next = { ...cur };
      delete next[editKey(lang, idx)];
      return next;
    });
  }, []);

  /** Проверка каждой правки: то же правило, что у сервера (он всё равно перепроверит). */
  const checks = useMemo(() => {
    const out: Record<string, TextCheck> = {};
    if (!data) return out;
    for (const [ek, value] of Object.entries(edits)) {
      if (value === null) continue;
      const [lang, idx] = ek.split(":") as [TextLang, string];
      const item = data.items[Number(idx)];
      if (item) out[ek] = checkText(lang, item[0], value);
    }
    return out;
  }, [edits, data]);

  const view = useCallback(
    (idx: number, lang: TextLang): FieldView => {
      const item = data!.items[idx]!;
      const base = baseOf(item, lang);
      const live = data!.overrides[lang][item[0]];
      const ek = editKey(lang, idx);
      const edited = ek in edits;
      const edit = edits[ek];
      const value = edited ? (edit === null ? base : (edit ?? "")) : (live ?? base);
      const changed = edited && value.trim() !== (live ?? base);
      const check = edited && edit !== null ? checks[ek] : undefined;
      return { value, changed, published: live !== undefined, missing: lang !== "ru" && !base && live === undefined && !(edited && value.trim()), edited, errors: check?.errors ?? [], warnings: check?.warnings ?? [] };
    },
    [data, edits, checks],
  );

  const changedCount = useMemo(() => {
    if (!data) return 0;
    return Object.keys(edits).filter((ek) => {
      const [lang, idx] = ek.split(":") as [TextLang, string];
      const item = data.items[Number(idx)];
      if (!item) return false;
      const edit = edits[ek];
      const live = data.overrides[lang][item[0]];
      const value = edit === null ? baseOf(item, lang) : (edit ?? "").trim();
      return value !== (live ?? baseOf(item, lang));
    }).length;
  }, [edits, data]);
  const errorCount = Object.values(checks).filter((c) => c.errors.length).length;

  const groups = useMemo(() => {
    if (!data) return [];
    const missing = data.items.flatMap((item, idx) => ((!item[1] && data.overrides.ka[item[0]] === undefined) || (!item[2] && data.overrides.en[item[0]] === undefined) ? [idx] : []));
    const list: Group[] = [...data.groups];
    if (missing.length) list.splice(1, 0, { id: "__missing", name: "Без перевода", sub: "нет грузинского или английского", ids: missing });
    return list;
  }, [data]);

  const searching = search.length >= 2;
  const group = groups.find((g) => g.id === groupId) ?? groups[0];
  const ids = useMemo(() => {
    if (!data) return [];
    if (!searching) return group?.ids ?? [];
    const found: number[] = [];
    for (let i = 0; i < data.items.length && found.length < SEARCH_LIMIT; i++) {
      const item = data.items[i]!;
      const hay = [item[0], item[1], item[2], data.overrides.ru[item[0]], data.overrides.ka[item[0]], data.overrides.en[item[0]]].join("\u0001").toLowerCase();
      if (hay.includes(search)) found.push(i);
    }
    return found;
  }, [data, searching, search, group]);
  const shown = searching ? ids : ids.slice(0, limit);

  const editedPer = useMemo(() => {
    const idxs = new Set(Object.keys(edits).map((ek) => Number(ek.split(":")[1])));
    return (g: Group) => g.ids.reduce((n, i) => n + (idxs.has(i) ? 1 : 0), 0);
  }, [edits]);

  async function publish() {
    if (!data || busy || !changedCount || errorCount) return;
    if (!window.confirm(`Опубликовать правок: ${changedCount}? Они уйдут в GitHub, сайт обновится после пересборки.`)) return;
    const changes: Changes = {};
    for (const [ek, value] of Object.entries(edits)) {
      const [lang, idx] = ek.split(":") as [TextLang, string];
      const item = data.items[Number(idx)];
      if (!item) continue;
      (changes[lang] ??= {})[item[0]] = value;
    }
    setBusy(true);
    setNotice(null);
    setIssues([]);
    try {
      const r = await call<{ commit?: string; unchanged?: boolean; issues?: Issue[] }>("/publish", { method: "POST", body: JSON.stringify({ baseSha: data.sha, changes }) });
      if (r.status === 200) {
        setEdits({});
        setNotice({ kind: "ok", text: r.body.unchanged ? "Ничего не изменилось: все тексты уже такие." : `Опубликовано (коммит ${r.body.commit?.slice(0, 7) ?? ""}). Сайт обновится через 2–3 минуты после пересборки.` });
        await load();
      } else {
        setNotice({ kind: "error", text: r.body.message ?? NET_ERROR });
        if (r.body.issues) setIssues(r.body.issues);
        if (r.status === 409) await load();
      }
    } catch (e) {
      setNotice({ kind: "error", text: messageOf(e) });
    } finally {
      setBusy(false);
    }
  }

  if (loadError) return <p className="text-sm text-error">{loadError}</p>;
  if (!data) return <p className="text-sm text-muted">Загружаю тексты…</p>;

  const canPublish = data.configured && data.github.ok;
  const sigOf = (idx: number, f: Record<TextLang, FieldView>) => TEXT_LANGS.map((l) => `${f[l].value}\u0001${f[l].changed}${f[l].published}${f[l].missing}${f[l].edited}${f[l].errors.join("|")}${f[l].warnings.join("|")}`).join("\u0002") + idx;

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="flex flex-wrap items-center gap-3">
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по всем текстам (от 2 букв)" className={cn(FIELD, "min-w-0 flex-1 sm:max-w-md")} aria-label="Поиск по текстам" />
        <button type="button" onClick={() => setShowHistory((v) => !v)} className={GHOST} disabled={!canPublish}>
          {showHistory ? "Скрыть историю" : "История и откат"}
        </button>
        <span className="text-[11px] text-faint">{data.github.repo} · ветка {data.github.branch}</span>
        {data.pending && <span className="rounded-[1px] bg-copper px-2 py-1 text-[10px] font-bold tracking-[.08em] text-paper uppercase">ждёт пересборки сайта</span>}
      </div>

      {!data.github.ok && <p className="rounded-[2px] border border-line p-3 text-sm text-copper-light">{data.github.message ?? NET_ERROR}</p>}
      {data.github.buildBranch && data.github.buildBranch !== data.github.branch && (
        <p className="rounded-[2px] border border-error p-3 text-sm text-error">
          Сайт собран из ветки «{data.github.buildBranch}», а правки пишутся в ветку «{data.github.branch}»: на этом сайте они не появятся. Удалите переменную GITHUB_BRANCH у воркера и пересоберите сайт.
        </p>
      )}
      {notice && <p className={cn("rounded-[2px] border p-3 text-sm", notice.kind === "ok" ? "border-teal text-teal" : "border-error text-error")}>{notice.text}</p>}
      {issues.length > 0 && (
        <ul className="rounded-[2px] border border-error p-3 text-sm text-error">
          {issues.slice(0, 8).map((i) => (
            <li key={`${i.lang}:${i.key}:${i.message}`}>
              {LANG_NAME[i.lang]} · «{i.key.slice(0, 50)}»: {i.message}
            </li>
          ))}
        </ul>
      )}
      {showHistory && canPublish && <History sha={data.sha} dirty={changedCount > 0} onRolled={() => void load()} setNotice={setNotice} />}

      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div>
          <select value={group?.id ?? ""} onChange={(e) => { setGroupId(e.target.value); setLimit(PAGE_SIZE); setQuery(""); }} className={cn(FIELD, "w-full lg:hidden")} aria-label="Страница">
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.ids.length})
              </option>
            ))}
          </select>
          <nav className={cn(CARD, "hidden max-h-[70svh] flex-col gap-0.5 overflow-y-auto p-2 lg:flex")} aria-label="Страницы">
            {groups.map((g) => {
              const edited = editedPer(g);
              const active = !searching && g.id === group?.id;
              return (
                <button key={g.id} type="button" onClick={() => { setGroupId(g.id); setLimit(PAGE_SIZE); setQuery(""); }} className={cn("flex items-center gap-2 rounded-[2px] px-3 py-2 text-left text-sm transition-colors", active ? "bg-panel-soft text-paper" : "text-muted hover:text-paper")}>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{g.name}</span>
                    <span className="block truncate text-[11px] text-faint">{g.sub}</span>
                  </span>
                  {edited > 0 && <span className="rounded-[1px] bg-teal px-1.5 text-[11px] font-bold text-ink">{edited}</span>}
                  <span className="text-[11px] text-faint">{g.ids.length}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className={LABEL}>{searching ? `Найдено: ${ids.length}${ids.length >= SEARCH_LIMIT ? "+" : ""}` : `${group?.name ?? ""} · ${group?.ids.length ?? 0} строк`}</div>
          {shown.map((idx) => {
            const item = data.items[idx]!;
            const fields = { ru: view(idx, "ru"), ka: view(idx, "ka"), en: view(idx, "en") };
            return <Row key={idx} idx={idx} sig={sigOf(idx, fields)} keyText={item[0]} pages={item[3]} fields={fields} onEdit={onEdit} onReset={onReset} onUndo={onUndo} />;
          })}
          {!searching && ids.length > limit && (
            <button type="button" onClick={() => setLimit((n) => n + PAGE_SIZE)} className={cn(GHOST, "self-center")}>
              Показать ещё {Math.min(PAGE_SIZE, ids.length - limit)}
            </button>
          )}
          {shown.length === 0 && <p className="text-sm text-muted">{searching ? "Ничего не найдено." : "На этой странице нет строк."}</p>}
        </div>
      </div>

      <div className={cn(CARD, "sticky bottom-0 z-20 flex flex-wrap items-center gap-3 p-3")}>
        <span className="text-sm text-muted">{changedCount ? `Изменено строк: ${changedCount}${errorCount ? ` · с ошибками: ${errorCount}` : ""}` : "Правок пока нет."}</span>
        <span className="flex-1" />
        <button type="button" disabled={!hasEdits || busy} onClick={() => setEdits({})} className={GHOST}>
          Отменить все
        </button>
        <button type="button" disabled={!canPublish || busy || !changedCount || errorCount > 0} onClick={publish} className={BUTTON}>
          {busy ? "Публикую…" : `Опубликовать${changedCount ? ` (${changedCount})` : ""}`}
        </button>
      </div>
    </div>
  );
}
