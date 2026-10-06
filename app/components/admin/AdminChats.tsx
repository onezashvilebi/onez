import type { AdminMessage, ChatSummary } from "~/hooks/useAdmin";
import { Icon } from "~/components/ui/icons";
import { cn } from "~/lib/cn";
import { BUTTON, CARD, Empty, FIELD, LABEL, fmtTime } from "./AdminShell";

const LANG_NAME: Record<string, string> = { ka: "KA", ru: "RU", en: "EN" };
/** Строки источника приходят экранированными под HTML Telegram — в разметку React они идут текстом. */
export const plain = (s: string) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

type Props = {
  chats: ChatSummary[];
  active: ChatSummary | null;
  activeId: string | null;
  setActiveId: (id: string) => void;
  messages: AdminMessage[];
  browserLang: string;
  reply: string;
  setReply: (v: string) => void;
  sending: boolean;
  sendReply: (e?: React.FormEvent) => void;
  scroller: React.RefObject<HTMLDivElement | null>;
};

/** Страница «Чат»: слева разговоры, справа переписка и ответ менеджера в окно посетителя. */
export function AdminChats({ chats, active, activeId, setActiveId, messages, browserLang, reply, setReply, sending, sendReply, scroller }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
      <section className={cn(CARD, "flex max-h-[calc(100svh-11rem)] flex-col overflow-hidden", activeId && "max-lg:hidden")}>
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <span className={LABEL}>Разговоры</span>
          <span className="text-[11px] font-bold text-faint">{chats.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <Empty text="Разговоров пока нет" icon="chat" />
          ) : (
            chats.map((c) => (
              <button key={c.id} type="button" onClick={() => setActiveId(c.id)} className={cn("flex w-full flex-col gap-1.5 border-b border-line px-5 py-4 text-left transition-colors hover:bg-panel-soft", c.id === activeId && "bg-panel-soft")}>
                <div className="flex items-center gap-2">
                  <span className={cn("truncate text-[13px] font-bold", c.contact ? "text-paper" : "text-faint")}>{c.contact ?? "Без контакта"}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-faint">{fmtTime(c.lastAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="truncate text-[12px] text-paper-dim">{c.last ? `${c.last.from === "visitor" ? "" : "↩ "}${c.last.text}` : "—"}</span>
                  {c.unread > 0 && <span className="ml-auto shrink-0 rounded-[1px] bg-copper px-1.5 py-0.5 text-[10px] font-bold text-paper">{c.unread}</span>}
                </div>
                <div className="flex gap-3">
                  <span className={LABEL}>{LANG_NAME[c.lang] ?? c.lang}</span>
                  {c.manual && <span className="text-[10px] font-bold tracking-[.12em] text-teal uppercase">вы отвечаете</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      <section className={cn(CARD, "flex h-[calc(100svh-11rem)] min-h-[28rem] flex-col overflow-hidden", !activeId && "max-lg:hidden")}>
        {!active ? (
          <Empty text="Выберите разговор" icon="chat" />
        ) : (
          <>
            <header className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line px-5 py-4">
              <button type="button" onClick={() => setActiveId("")} className={cn(LABEL, "transition-colors hover:text-teal lg:hidden")}>
                ← Разговоры
              </button>
              <span className={cn("text-[13px] font-bold", active.contact ? "text-paper" : "text-faint")}>{active.contact ?? "Контакт не оставлен"}</span>
              <span className={LABEL}>
                {LANG_NAME[active.lang] ?? active.lang}
                {browserLang && ` · браузер ${browserLang.split(",")[0]}`}
              </span>
              <a href={active.page} target="_blank" rel="noreferrer" className="truncate text-[11px] text-muted transition-colors hover:text-teal">
                {active.page.replace(/^https?:\/\/[^/]+/, "") || "/"}
              </a>
              {active.source.length > 0 && <span className="w-full text-[11px] text-faint">{active.source.map(plain).join(" · ")}</span>}
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-5">
              {messages.map((m) => {
                const visitor = m.from === "visitor";
                const manager = m.author === "Менеджер ONEZA";
                return (
                  <div key={m.id} className={cn("flex flex-col", visitor ? "items-start" : "items-end")}>
                    <div className={cn(LABEL, "mb-1 px-1")}>
                      {visitor ? "Посетитель" : (m.author ?? "ONEZA")} · {fmtTime(m.at)}
                    </div>
                    {/* Сообщение менеджера — бирюзой, как реплика посетителя в окне сайта: свой голос всегда акцентный. */}
                    <div className={cn("max-w-[80%] border px-3.5 py-2.5 text-[13px] leading-relaxed break-words whitespace-pre-line", visitor ? "border-line bg-panel-soft text-paper-dim" : manager ? "border-teal/30 bg-teal/10 text-paper" : "border-line bg-ink text-muted")}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendReply} className="flex items-end gap-2 border-t border-line p-3">
              <label htmlFor="onez-admin-reply" className="sr-only">Ответ посетителю</label>
              <textarea
                id="onez-admin-reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                rows={1}
                placeholder={active.manual ? "Ответ посетителю…" : "Ответить самому — ассистент в этом разговоре замолчит"}
                className={cn(FIELD, "max-h-32 min-h-11 flex-1 resize-none py-2.5")}
              />
              <button type="submit" disabled={sending || !reply.trim()} aria-label="Отправить" className={cn(BUTTON, "size-11 shrink-0 p-0")}>
                <Icon name="send" className="size-5" />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
