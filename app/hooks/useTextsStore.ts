import { useCallback, useEffect, useMemo, useState } from "react";
import { TEXT_LANGS, checkText, type Changes, type Overrides, type TextCheck, type TextLang } from "~/lib/texts-check";

// Данные и правки для раздела «Страницы»: загрузка строк с сервера (workers/texts.ts),
// несохранённые правки, проверка и публикация одним коммитом. Раздел «Тексты» держит
// свою копию этой логики, чтобы оба раздела можно было менять независимо.

export type Item = readonly [key: string, ka: string, en: string, pages: number];
export type Group = { id: string; name: string; sub: string; ids: number[] };
export type Github = { ok: boolean; error?: string; message?: string; repo: string; branch: string; buildBranch?: string };
export type Data = { configured: boolean; github: Github; groups: Group[]; items: Item[]; overrides: Overrides; sha: string | null; pending: boolean };
export type Issue = { lang: TextLang; key: string; message: string };
/** Несохранённые правки: «язык:номер строки» → новый текст (null — вернуть исходный). */
export type Edits = Record<string, string | null>;
export type Notice = { kind: "ok" | "error"; text: string } | null;
export type FieldState = { value: string; base: string; changed: boolean; published: boolean; missing: boolean; errors: string[]; warnings: string[] };

export const NET_ERROR = "Не удалось выполнить запрос. Проверьте связь и обновите страницу.";
export const editKey = (lang: TextLang, idx: number) => `${lang}:${idx}`;
export const baseOf = (item: Item, lang: TextLang) => (lang === "ru" ? item[0] : lang === "ka" ? item[1] : item[2]);
export const messageOf = (e: unknown) => (e instanceof Error && /[А-Яа-яЁё]/.test(e.message) ? e.message : NET_ERROR);

export async function call<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T & { error?: string; message?: string } }> {
  const resp = await fetch(`/api/admin/texts${path}`, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
  if (resp.status === 401) throw new Error("Сессия закончилась. Обновите страницу и войдите заново.");
  const body = (await resp.json().catch(() => ({}))) as T & { error?: string; message?: string };
  return { status: resp.status, body };
}

export function useTextsStore() {
  const [data, setData] = useState<Data | null>(null);
  const [loadError, setLoadError] = useState("");
  const [edits, setEdits] = useState<Edits>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const load = useCallback(async () => {
    try {
      const r = await call<Data>("");
      if (r.status !== 200) throw new Error(NET_ERROR);
      setData(r.body);
      setLoadError("");
    } catch (e) {
      setLoadError(messageOf(e));
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

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

  /** Что сейчас в поле: несохранённая правка, иначе опубликованная в GitHub, иначе исходный текст. */
  const field = useCallback(
    (idx: number, lang: TextLang): FieldState => {
      const item = data!.items[idx]!;
      const base = baseOf(item, lang);
      const live = data!.overrides[lang][item[0]];
      const ek = editKey(lang, idx);
      const edited = ek in edits;
      const edit = edits[ek];
      const value = edited ? (edit === null ? base : (edit ?? "")) : (live ?? base);
      const check = edited && edit !== null ? checks[ek] : undefined;
      return {
        value,
        base,
        changed: edited && value.trim() !== (live ?? base),
        published: live !== undefined,
        missing: lang !== "ru" && !base && live === undefined && !(edited && value.trim()),
        errors: check?.errors ?? [],
        warnings: check?.warnings ?? [],
      };
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
      const value = edit === null ? baseOf(item, lang) : (edit ?? "").trim();
      return value !== (data.overrides[lang][item[0]] ?? baseOf(item, lang));
    }).length;
  }, [edits, data]);
  const errorCount = Object.values(checks).filter((c) => c.errors.length).length;

  const publish = useCallback(async () => {
    if (!data || busy || !changedCount || errorCount) return;
    if (!window.confirm(`Опубликовать правок: ${changedCount}? Они уйдут в GitHub, сайт обновится после пересборки.`)) return;
    const changes: Changes = {};
    for (const [ek, value] of Object.entries(edits)) {
      const [lang, idx] = ek.split(":") as [TextLang, string];
      const item = data.items[Number(idx)];
      if (item) (changes[lang] ??= {})[item[0]] = value;
    }
    setBusy(true);
    setNotice(null);
    setIssues([]);
    try {
      const r = await call<{ commit?: string; unchanged?: boolean; issues?: Issue[] }>("/publish", { method: "POST", body: JSON.stringify({ baseSha: data.sha, changes }) });
      if (r.status === 200) {
        setEdits({});
        setNotice({ kind: "ok", text: r.body.unchanged ? "Ничего не изменилось: все тексты уже такие." : `Опубликовано (коммит ${r.body.commit?.slice(0, 7) ?? ""}). Сайт обновится через 2–3 минуты после пересборки; потом нажмите «Обновить макет».` });
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
  }, [data, busy, changedCount, errorCount, edits, load]);

  return { data, loadError, edits, setEdits, busy, notice, issues, hasEdits, changedCount, errorCount, field, onEdit, onReset, onUndo, publish, load, TEXT_LANGS };
}
