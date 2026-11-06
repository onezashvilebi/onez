import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BUTTON, CARD, FIELD, GHOST, LABEL } from "~/components/admin/AdminShell";
import { useTextsStore, type FieldState, type Group } from "~/hooks/useTextsStore";
import { translate } from "~/i18n/context";
import deployedOverrides from "~/i18n/overrides.json";
import { cn } from "~/lib/cn";
import { applyHtml, canonical, flashBlock, installEditUi, listBlocks, originalHtml, rememberOriginal, scanEditable, setActive, showAll, type Block, type Flag } from "~/lib/page-editor-dom";
import { TEXT_LANGS, type TextLang } from "~/lib/texts-check";
import { PAGES, pageOf, pathFor } from "~/site/pages";

// Раздел «Страницы»: страница сайта показывается как есть (готовый пререндер в iframe
// без скриптов), текст выбирается кликом, а три языка выбранной строки правятся в
// панели справа; изменения сразу видны в макете. Публикация — тем же коммитом в
// GitHub, что и в разделе «Тексты». Сейчас правится только текст; блоки страницы
// (список ниже) — задел под будущее.

const LANG_NAME: Record<TextLang, string> = { ru: "Русский", ka: "Грузинский", en: "Английский" };
const LANG_SHORT: Record<TextLang, string> = { ru: "RU", ka: "KA", en: "EN" };
/** Тексты в том виде, в каком они вшиты в текущую сборку сайта: именно их показывает iframe. */
const DEPLOYED = deployedOverrides as unknown as Record<TextLang, Record<string, string>>;

type Picked = { el: HTMLElement; keys: string[]; key: string | null };

function FieldEditor({ lang, f, onChange, onUndo, onReset }: { lang: TextLang; f: FieldState; onChange: (text: string) => void; onUndo: () => void; onReset: () => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={LABEL}>{LANG_NAME[lang]}</span>
        {f.changed && <span className="rounded-[1px] bg-teal px-1.5 py-0.5 text-[10px] font-bold text-ink uppercase">изменено</span>}
        {!f.changed && f.published && <span className="rounded-[1px] border border-line px-1.5 py-0.5 text-[10px] font-bold text-teal uppercase">правка</span>}
        {f.missing && <span className="rounded-[1px] bg-copper px-1.5 py-0.5 text-[10px] font-bold text-paper uppercase">нет перевода</span>}
      </div>
      <textarea
        value={f.value}
        rows={Math.min(10, Math.max(3, Math.ceil(f.value.length / 30)))}
        onChange={(e) => onChange(e.target.value)}
        lang={lang}
        spellCheck={lang !== "ka"}
        aria-label={LANG_NAME[lang]}
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
            <button type="button" onClick={onUndo} className="text-muted transition-colors hover:text-teal">
              Отменить
            </button>
          )}
          <button type="button" onClick={onReset} className="text-muted transition-colors hover:text-teal">
            К исходному
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminPages() {
  const store = useTextsStore();
  const { data, field, edits } = store;
  const [lang, setLang] = useState<TextLang>("ru");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState(false);
  const [outline, setOutline] = useState(false);
  const [filter, setFilter] = useState("");
  const [frameKey, setFrameKey] = useState(0);
  const [frameVersion, setFrameVersion] = useState(0);
  const [found, setFound] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pick, setPick] = useState<Picked | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const flags = useRef<Flag[]>([]);
  const cleanup = useRef<(() => void) | null>(null);
  const outlineRef = useRef(outline);
  outlineRef.current = outline;

  // Страница с одним языком (англоязычный лендинг) всегда открывается на нём.
  const shownLang: TextLang = pageOf(slug)?.only ?? lang;
  const src = pathFor(lang, slug);

  const keyIndex = useMemo(() => new Map((data?.items ?? []).map((item, i) => [item[0], i] as const)), [data]);
  const groupBySlug = useMemo(() => {
    const map = new Map<string, Group>();
    for (const g of data?.groups ?? []) map.set(g.id === "__home" ? "" : g.id, g);
    return map;
  }, [data]);
  const pages = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return PAGES.map((p) => ({ slug: p.slug, name: groupBySlug.get(p.slug)?.name ?? (p.slug ? `/${p.slug}` : "Главная"), count: groupBySlug.get(p.slug)?.ids.length ?? 0 })).filter((p) => !q || `${p.name} ${p.slug}`.toLowerCase().includes(q));
  }, [filter, groupBySlug]);

  /** Что сейчас вшито в сайт для строки: правка из сборки или исходный текст. */
  const deployedValue = useCallback(
    (idx: number, l: TextLang) => {
      const item = data!.items[idx]!;
      const own = DEPLOYED[l]?.[item[0]];
      if (own !== undefined) return own;
      return l === "ru" ? item[0] : l === "ka" ? item[1] : item[2];
    },
    [data],
  );
  /** Текст на странице после translate(): с заменой «м²» и «К-1», как на сайте. */
  const shown = useCallback((l: TextLang, key: string, value: string) => (value || l === "ru" ? translate({ lang: l, dict: { [key]: value } }, key) : key), []);

  const onPickEl = useCallback((el: HTMLElement) => {
    const flag = flags.current.find((f) => f.el === el);
    if (!flag) return;
    setPick({ el, keys: flag.keys, key: flag.keys.length === 1 ? (flag.keys[0] ?? null) : null });
    setActive(el.ownerDocument, el);
  }, []);

  const onFrameLoad = useCallback(() => {
    cleanup.current?.();
    cleanup.current = null;
    const doc = frame.current?.contentDocument;
    if (!doc?.body || !data) return;
    // Ищем только строки этой страницы и общие: меньше случайных совпадений.
    const common = data.groups.find((g) => g.id === "__common");
    const own = groupBySlug.get(slug);
    const allowed = own ? new Set([...(common?.ids ?? []), ...own.ids]) : null;
    const index = new Map<string, string[]>();
    data.items.forEach((item, idx) => {
      if (allowed && !allowed.has(idx)) return;
      const text = canonical(doc, shown(shownLang, item[0], deployedValue(idx, shownLang)));
      if (!text) return;
      const list = index.get(text);
      if (list) list.push(item[0]);
      else index.set(text, [item[0]]);
    });
    const list = scanEditable(doc, index);
    for (const f of list) rememberOriginal(f.el);
    flags.current = list;
    setFound(list.length);
    setBlocks(listBlocks(doc));
    setPick(null);
    showAll(doc, outlineRef.current);
    cleanup.current = installEditUi(doc, onPickEl);
    setFrameVersion((v) => v + 1);
  }, [data, groupBySlug, slug, shownLang, deployedValue, shown, onPickEl]);

  useEffect(() => () => cleanup.current?.(), []);
  useEffect(() => {
    const doc = frame.current?.contentDocument;
    if (doc?.body) showAll(doc, outline);
  }, [outline]);

  // Живой предпросмотр: тексты в макете подменяются на правки, которых в сборке ещё нет
  // (несохранённые и опубликованные, но ещё не пересобранные); совпавшие со сборкой возвращаются как были.
  useEffect(() => {
    if (!data) return;
    for (const f of flags.current) {
      const key = f.keys.length === 1 ? (f.keys[0] ?? null) : pick?.el === f.el ? pick.key : null;
      const idx = key === null ? undefined : keyIndex.get(key);
      if (key === null || idx === undefined) {
        applyHtml(f.el, originalHtml(f.el));
        continue;
      }
      const current = field(idx, shownLang).value;
      applyHtml(f.el, current === deployedValue(idx, shownLang) ? originalHtml(f.el) : shown(shownLang, key, current));
    }
  }, [data, edits, field, pick, shownLang, frameVersion, keyIndex, deployedValue, shown]);

  if (store.loadError) return <p className="text-sm text-error">{store.loadError}</p>;
  if (!data) return <p className="text-sm text-muted">Загружаю страницы…</p>;

  const idx = pick?.key ? keyIndex.get(pick.key) : undefined;
  const item = idx === undefined ? null : data.items[idx];
  const canPublish = data.configured && data.github.ok;

  return (
    <div className="flex flex-col gap-3 pb-24">
      {!data.github.ok && <p className="rounded-[2px] border border-line p-3 text-sm text-copper-light">{data.github.message}</p>}
      {store.notice && <p className={cn("rounded-[2px] border p-3 text-sm", store.notice.kind === "ok" ? "border-teal text-teal" : "border-error text-error")}>{store.notice.text}</p>}
      {store.issues.length > 0 && (
        <ul className="rounded-[2px] border border-error p-3 text-sm text-error">
          {store.issues.slice(0, 8).map((i) => (
            <li key={`${i.lang}:${i.key}:${i.message}`}>
              {LANG_NAME[i.lang]} · «{i.key.slice(0, 50)}»: {i.message}
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 lg:grid-cols-[14rem_minmax(0,1fr)_21rem]">
        <div className={cn(CARD, "flex max-h-[78svh] flex-col gap-2 p-2")}>
          <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Найти страницу" className={cn(FIELD, "w-full py-2")} aria-label="Найти страницу" />
          <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto" aria-label="Страницы сайта">
            {pages.map((p) => (
              <button key={p.slug || "home"} type="button" onClick={() => { setSlug(p.slug); setPick(null); }} className={cn("flex items-center gap-2 rounded-[2px] px-3 py-2 text-left text-sm transition-colors", p.slug === slug ? "bg-panel-soft text-paper" : "text-muted hover:text-paper")}>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{p.name}</span>
                  <span className="block truncate text-[11px] text-faint">/{p.slug}</span>
                </span>
                <span className="text-[11px] text-faint">{p.count}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {TEXT_LANGS.map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={cn(GHOST, "px-3 py-1.5", shownLang === l && "border-teal text-teal")} aria-pressed={shownLang === l}>
                {LANG_SHORT[l]}
              </button>
            ))}
            <span className="w-2" />
            <button type="button" onClick={() => setPhone((v) => !v)} className={cn(GHOST, "px-3 py-1.5", phone && "border-teal text-teal")} aria-pressed={phone}>
              Телефон
            </button>
            <button type="button" onClick={() => setOutline((v) => !v)} className={cn(GHOST, "px-3 py-1.5", outline && "border-teal text-teal")} aria-pressed={outline}>
              Подсветить тексты
            </button>
            <button type="button" onClick={() => setFrameKey((k) => k + 1)} className={cn(GHOST, "px-3 py-1.5")}>
              Обновить макет
            </button>
            <span className="text-[11px] text-faint">{data.pending ? "Сборка ещё идёт: макет покажет новые тексты позже" : found === null ? "" : `Редактируемых текстов: ${found}`}</span>
          </div>
          <div className={cn(CARD, "h-[78svh] overflow-hidden bg-ink p-0")}>
            <div className={cn("mx-auto h-full bg-white", phone ? "w-[390px] max-w-full" : "w-full")}>
              <iframe key={`${frameKey}:${src}`} ref={frame} src={src} title="Макет страницы" sandbox="allow-same-origin" onLoad={onFrameLoad} className="h-full w-full border-0" />
            </div>
          </div>
        </div>

        <div className="flex max-h-[78svh] min-w-0 flex-col gap-3 overflow-y-auto">
          {pick && pick.key === null && (
            <div className={cn(CARD, "flex flex-col gap-2 p-4")}>
              <div className={LABEL}>Какую строку правите?</div>
              <p className="text-[12px] text-muted">Этот текст в выбранном языке совпадает у нескольких строк. Выберите нужную по русскому оригиналу.</p>
              {pick.keys.map((k) => (
                <button key={k} type="button" onClick={() => setPick({ ...pick, key: k })} className={cn(GHOST, "justify-start text-left normal-case")}>
                  {k.slice(0, 90)}
                </button>
              ))}
            </div>
          )}
          {item && idx !== undefined && (
            <div className={cn(CARD, "flex flex-col gap-4 p-4")}>
              <div className={LABEL}>Выбранный текст</div>
              {item[3] > 1 && <p className="text-[11px] text-faint">Эта строка есть ещё на {item[3] - 1} стр.: правка изменит её везде.</p>}
              {TEXT_LANGS.map((l) => (
                <FieldEditor key={l} lang={l} f={field(idx, l)} onChange={(text) => store.onEdit(idx, l, text)} onUndo={() => store.onUndo(idx, l)} onReset={() => store.onReset(idx, l)} />
              ))}
            </div>
          )}
          {!pick && (
            <div className={cn(CARD, "flex flex-col gap-2 p-4")}>
              <div className={LABEL}>Как править</div>
              <p className="text-sm text-muted">Нажмите на любой текст в макете: справа откроются три языка этой строки. Изменения видны в макете сразу, на сайт они уходят кнопкой «Опубликовать».</p>
              <p className="text-[12px] text-faint">Тексты меню, кнопок во всплывающих окнах и подписи к картинкам в макете не кликаются: их правьте в разделе «Тексты».</p>
            </div>
          )}
          {blocks.length > 0 && (
            <div className={cn(CARD, "flex flex-col gap-1 p-4")}>
              <div className={LABEL}>Блоки страницы</div>
              {blocks.map((b, i) => (
                <button key={`${i}:${b.label}`} type="button" onClick={() => flashBlock(b.el)} className="truncate rounded-[2px] px-2 py-1.5 text-left text-sm text-muted transition-colors hover:bg-panel-soft hover:text-paper">
                  {i + 1}. {b.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={cn(CARD, "sticky bottom-0 z-20 flex flex-wrap items-center gap-3 p-3")}>
        <span className="text-sm text-muted">{store.changedCount ? `Изменено строк: ${store.changedCount}${store.errorCount ? ` · с ошибками: ${store.errorCount}` : ""}` : "Правок пока нет."}</span>
        <span className="text-[11px] text-faint">{data.github.repo} · ветка {data.github.branch}</span>
        <span className="flex-1" />
        <button type="button" disabled={!store.hasEdits || store.busy} onClick={() => store.setEdits({})} className={GHOST}>
          Отменить все
        </button>
        <button type="button" disabled={!canPublish || store.busy || !store.changedCount || store.errorCount > 0} onClick={() => void store.publish()} className={BUTTON}>
          {store.busy ? "Публикую…" : `Опубликовать${store.changedCount ? ` (${store.changedCount})` : ""}`}
        </button>
      </div>
    </div>
  );
}
