import { Icon } from "~/components/ui/icons";
import { ContactLink } from "~/components/ui/primitives";
import { useLiveChat, type ChatMessage } from "~/hooks/useLiveChat";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";

function Bubble({ message, children }: { message: Pick<ChatMessage, "from" | "author">; children: string }) {
  const { t } = useI18n();
  const visitor = message.from === "visitor";
  return (
    <div className={cn("max-w-[85%] border px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line", visitor ? "ml-auto border-teal/30 bg-teal/10 text-paper" : "mr-auto border-line bg-panel-soft text-paper-dim")}>
      {!visitor && message.author && <span className="mb-1 block text-[10px] font-bold tracking-[.08em] text-teal uppercase">{t(message.author)}</span>}
      {children}
    </div>
  );
}

/** Онлайн-чат в углу экрана на всех страницах; состояние — useLiveChat. */
export function LiveChat() {
  const { t } = useI18n();
  const chat = useLiveChat();
  if (!chat.mounted) return null;

  return (
    // На мобильном — выше нижней панели MobileCta (закон 6: WhatsApp и телефон — в шапке).
    <div className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+88px)] z-90 flex flex-col items-end gap-3 tab:right-7 tab:bottom-7">
      {chat.open && (
        <section ref={chat.dialog} role="dialog" aria-modal="true" aria-label={t("Онлайн-чат ONEZA")} className="flex h-[min(34rem,calc(100svh-9rem))] w-[min(23rem,calc(100vw-2rem))] flex-col border border-line bg-panel text-paper shadow-panel">
          <header className="flex items-start gap-3 border-b border-line p-4">
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-[1px] bg-teal text-ink">
              <Icon name="chat" className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[13px] font-semibold tracking-[.02em] uppercase">{t("Онлайн-консультация")}</p>
              <p className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                <span aria-hidden="true" className="size-1.5 shrink-0 animate-pulse bg-teal" />
                {t("Отвечаем здесь же, обычно за несколько минут")}
              </p>
            </div>
            <button type="button" onClick={chat.close} aria-label={t("Закрыть чат")} className="-m-1 grid size-9 place-items-center text-muted transition-colors hover:text-paper">
              <Icon name="close" className="size-5" />
            </button>
          </header>

          <div ref={chat.scroller} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
            <Bubble message={{ from: "agent", author: "ONEZA Construction" }}>{t("Здравствуйте! Расскажите, что планируете строить, — подскажем по этапам, срокам и стоимости.")}</Bubble>
            {chat.messages.map((m) => (
              <Bubble key={m.id} message={m}>{m.text}</Bubble>
            ))}
            {chat.waiting && (
              <div aria-label={t("Печатает…")} className="mr-auto flex gap-1.5 border border-line bg-panel-soft px-3.5 py-3.5">
                {["", "[animation-delay:.15s]", "[animation-delay:.3s]"].map((delay) => (
                  <span key={delay} className={cn("size-1.5 animate-bounce bg-muted", delay)} />
                ))}
              </div>
            )}
            {chat.askPhone && (
              // Не блокирует разговор: писать можно и без контакта, но без него переписку
              // менеджеры не увидят — воркер её не отправляет.
              <form onSubmit={chat.sendPhone} className="border border-teal/40 bg-ink/60 p-3.5">
                <p className="flex items-start gap-2.5 text-[12px] leading-relaxed text-paper-dim">
                  <Icon name="phone" className="mt-0.5 size-4 shrink-0 text-teal" />
                  {t("Оставьте телефон или ник в мессенджере — тогда менеджер прочитает разговор и свяжется, даже если вы закроете чат.")}
                </p>
                <div className="mt-3 flex gap-2">
                  <label htmlFor="onez-chat-phone" className="sr-only">{t("Телефон, WhatsApp или Telegram")}</label>
                  <input id="onez-chat-phone" type="tel" autoComplete="tel" value={chat.phone} onChange={(e) => chat.setPhone(e.target.value)} placeholder={t("+995 или @username")} className="h-10 min-w-0 flex-1 border border-field bg-ink px-3 text-[13px] text-paper outline-none placeholder:text-faint focus:border-teal" />
                  <button type="submit" disabled={chat.sending || !chat.phoneValid} className="h-10 shrink-0 rounded-[1px] bg-teal px-4 text-[12px] font-bold text-ink transition-opacity disabled:opacity-40">
                    {t("Оставить")}
                  </button>
                </div>
              </form>
            )}
            {chat.failed && (
              <p className="text-[12px] text-error [&_a]:underline">
                {t("Не удалось отправить. Попробуйте ещё раз или напишите нам в")} <ContactLink channel="whatsapp" />.
              </p>
            )}
          </div>

          <form onSubmit={chat.send} className="flex items-end gap-2 border-t border-line p-3">
            <label htmlFor="onez-chat-input" className="sr-only">{t("Сообщение")}</label>
            <textarea
              id="onez-chat-input"
              ref={chat.input}
              rows={1}
              value={chat.draft}
              onChange={(e) => chat.setDraft(e.target.value)}
              onKeyDown={chat.onKeyDown}
              placeholder={t("Напишите вопрос…")}
              maxLength={2000}
              className="max-h-28 min-h-11 flex-1 resize-none border border-field bg-ink px-3 py-2.5 text-[13px] text-paper outline-none placeholder:text-faint focus:border-teal"
            />
            <button type="submit" disabled={chat.sending || !chat.draft.trim()} aria-label={t("Отправить сообщение")} className="grid size-11 shrink-0 place-items-center rounded-[1px] bg-teal text-ink transition-opacity disabled:opacity-40">
              <Icon name="send" className="size-5" />
            </button>
          </form>
        </section>
      )}

      {/* Круглая — единственное исключение из квадратных рамок значков (DESIGN_SYSTEM.md): это
          главная кнопка связи внизу экрана, её форма узнаваема на любом сайте. */}
      <button ref={chat.toggler} type="button" onClick={chat.toggle} aria-expanded={chat.open} aria-label={t(chat.open ? "Закрыть чат" : "Открыть онлайн-чат")} className="grid size-14 place-items-center rounded-full bg-teal text-ink shadow-float transition-transform duration-250 hover:-translate-y-0.5">
        <Icon name={chat.open ? "close" : "chat"} className="size-6" />
      </button>
    </div>
  );
}
