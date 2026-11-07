import { useCallback, useEffect, useState } from "react";
import { BUTTON, CARD, LABEL, fmtTime } from "~/components/admin/AdminShell";
import { NET_ERROR, call, messageOf } from "~/hooks/useTextsStore";
import { cn } from "~/lib/cn";
import type { TextLang } from "~/lib/texts-check";

// История публикаций раздела «Страницы»: список, по клику — что именно и где изменилось,
// и кнопка отмены только этой публикации (остальные правки остаются). Отмена — новый
// коммит в GitHub, поэтому её можно отменить так же, как любую другую публикацию.

type Commit = { sha: string; date: string; message: string; author: string };
type Change = { lang: TextLang; key: string; before: string | null; after: string | null };
type Detail = { sha: string; date: string; author: string; message: string; total: number; changes: Change[] };
type Notice = { kind: "ok" | "error"; text: string } | null;

const LANG_NAME: Record<TextLang, string> = { ru: "Русский", ka: "Грузинский", en: "Английский" };
const when = (iso: string) => (iso ? fmtTime(Date.parse(iso)) : "");

function Version({ title, text }: { title: string; text: string | null }) {
  return (
    <div className="min-w-0">
      <div className={LABEL}>{title}</div>
      <p className={cn("mt-1 text-sm break-words whitespace-pre-wrap", text === null ? "text-faint italic" : "text-paper")}>{text ?? "— без правки: исходный текст —"}</p>
    </div>
  );
}

export function PagesHistory({ repo, sha, placesOf, onChanged }: { repo: string; sha: string | null; placesOf: (key: string) => string[]; onChanged: () => void }) {
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailError, setDetailError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  // Список обновляется, когда меняется файл правок (sha): после публикации или отмены.
  useEffect(() => {
    let cancelled = false;
    call<{ commits: Commit[] }>("/history")
      .then((r) => {
        if (cancelled) return;
        if (r.status === 200) {
          setCommits(r.body.commits);
          setError("");
        } else setError(r.body.message ?? NET_ERROR);
      })
      .catch((e) => !cancelled && setError(messageOf(e)));
    return () => {
      cancelled = true;
    };
  }, [sha]);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setDetail(null);
    setDetailError("");
    call<Detail>(`/commit?sha=${selected}`)
      .then((r) => {
        if (cancelled) return;
        if (r.status === 200) setDetail(r.body);
        else setDetailError(r.body.message ?? NET_ERROR);
      })
      .catch((e) => !cancelled && setDetailError(messageOf(e)));
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const undo = useCallback(async () => {
    if (!detail || busy) return;
    if (!window.confirm(`Отменить эту публикацию? Тексты в ${detail.total} строках вернутся к тому, что было до неё. Если строку потом изменила другая публикация, она останется как есть.`)) return;
    setBusy(true);
    setNotice(null);
    try {
      const r = await call<{ reverted?: number; skipped?: number; unchanged?: boolean }>("/undo", { method: "POST", body: JSON.stringify({ sha: detail.sha, baseSha: sha }) });
      if (r.status === 200) {
        const skipped = r.body.skipped ? ` Пропущено строк, которые потом изменили другие публикации: ${r.body.skipped}.` : "";
        setNotice({ kind: "ok", text: r.body.unchanged ? `Отменять нечего: эти строки уже изменены другими публикациями.${skipped}` : `Публикация отменена: восстановлено строк — ${r.body.reverted}.${skipped} Сайт обновится через 2–3 минуты.` });
        onChanged();
      } else {
        setNotice({ kind: "error", text: r.body.message ?? NET_ERROR });
        if (r.status === 409) onChanged();
      }
    } catch (e) {
      setNotice({ kind: "error", text: messageOf(e) });
    } finally {
      setBusy(false);
    }
  }, [detail, busy, sha, onChanged]);

  return (
    <div className="flex flex-col gap-3">
      {notice && <p className={cn("rounded-[2px] border p-3 text-sm", notice.kind === "ok" ? "border-teal text-teal" : "border-error text-error")}>{notice.text}</p>}
      <div className="grid gap-3 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className={cn(CARD, "flex max-h-[78svh] flex-col gap-0.5 overflow-y-auto p-2")}>
          <div className={cn(LABEL, "px-3 py-2")}>Последние публикации</div>
          {error && <p className="px-3 py-2 text-sm text-error">{error}</p>}
          {!error && !commits && <p className="px-3 py-2 text-sm text-muted">Загружаю…</p>}
          {commits?.length === 0 && <p className="px-3 py-2 text-sm text-muted">Публикаций пока не было.</p>}
          {commits?.map((c, i) => (
            <button key={c.sha} type="button" onClick={() => setSelected(c.sha)} className={cn("flex flex-col gap-0.5 rounded-[2px] px-3 py-2 text-left text-sm transition-colors", selected === c.sha ? "bg-panel-soft text-paper" : "text-muted hover:text-paper")}>
              <span className="truncate">{c.message}</span>
              <span className="text-[11px] text-faint">
                {when(c.date)} · {c.sha.slice(0, 7)}
                {i === 0 ? " · последняя" : ""}
              </span>
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {!selected && (
            <div className={cn(CARD, "p-4")}>
              <div className={LABEL}>Как пользоваться</div>
              <p className="mt-2 text-sm text-muted">Выберите публикацию слева: здесь появится, какие тексты и на каких страницах в ней менялись. Кнопка «Отменить эту публикацию» возвращает только её строки, остальные правки остаются.</p>
            </div>
          )}
          {selected && detailError && <p className="text-sm text-error">{detailError}</p>}
          {selected && !detail && !detailError && <p className="text-sm text-muted">Загружаю подробности…</p>}
          {detail && (
            <>
              <div className={cn(CARD, "flex flex-wrap items-center gap-3 p-4")}>
                <div className="min-w-0 flex-1">
                  <div className="text-sm break-words text-paper">{detail.message}</div>
                  <div className="mt-1 text-[11px] text-faint">
                    {when(detail.date)} · {detail.author} ·{" "}
                    <a href={`https://github.com/${repo}/commit/${detail.sha}`} target="_blank" rel="noreferrer" className="underline hover:text-teal">
                      {detail.sha.slice(0, 7)} на GitHub
                    </a>
                  </div>
                </div>
                <button type="button" onClick={() => void undo()} disabled={busy || !sha || detail.total === 0} className={BUTTON}>
                  {busy ? "Отменяю…" : "Отменить эту публикацию"}
                </button>
              </div>
              {detail.total === 0 && <p className="text-sm text-muted">В этой публикации нет изменений текстов (например, это откат или пустой коммит).</p>}
              {detail.total > detail.changes.length && <p className="text-[12px] text-faint">Показаны первые {detail.changes.length} из {detail.total} изменений; отмена затронет все.</p>}
              {detail.changes.map((c) => {
                const places = placesOf(c.key);
                return (
                  <div key={`${c.lang}:${c.key}`} className={cn(CARD, "flex flex-col gap-3 p-4")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[1px] border border-line px-1.5 py-0.5 text-[10px] font-bold text-teal uppercase">{LANG_NAME[c.lang]}</span>
                      <span className="min-w-0 flex-1 truncate text-[12px] text-faint">«{c.key.slice(0, 110)}»</span>
                    </div>
                    {places.length > 0 && <p className="text-[11px] text-faint">Где на сайте: {places.slice(0, 4).join(", ")}{places.length > 4 ? ` и ещё ${places.length - 4}` : ""}</p>}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Version title="Было" text={c.before} />
                      <Version title="Стало" text={c.after} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
