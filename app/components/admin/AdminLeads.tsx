import type { Lead } from "~/hooks/useAdmin";
import { cn } from "~/lib/cn";
import { plain } from "./AdminChats";
import { CARD, Empty, LABEL, fmtTime } from "./AdminShell";

const FORM_TITLE: Record<string, string> = { estimate: "Расчёт объекта", cadastral: "Проверка участка", foreign: "Build in Georgia" };

/** Ссылка «ответить»: WhatsApp по номеру или Telegram по нику — как кнопка в сообщении бота. */
function replyHref(rows: Lead["rows"]): string | null {
  const contact = rows.find((r) => /Телефон|Phone/i.test(r.label))?.value ?? "";
  const nick = contact.match(/@([A-Za-z0-9_]{4,32})/)?.[1];
  if (nick) return `https://t.me/${nick}`;
  const digits = contact.replace(/\D/g, "");
  if (digits.length < 9) return null;
  return `https://wa.me/${digits.length === 9 ? `995${digits}` : digits}`;
}

/** Кнопки строки: написать в мессенджер и отметка «обработана». */
function Actions({ lead, onToggle }: { lead: Lead; onToggle: (lead: Lead) => void }) {
  const href = replyHref(lead.rows);
  return (
    <div className="flex items-center gap-2">
      {href && (
        // Медная кнопка на экране одна — в окне чата (закон 6); действие строки контурное.
        <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[2px] border border-teal/40 px-4 py-2 text-[11px] font-bold tracking-[.08em] text-teal uppercase transition-colors hover:bg-teal/10">
          Написать
        </a>
      )}
      <button type="button" onClick={() => onToggle(lead)} className={cn("rounded-[2px] px-4 py-2 text-[11px] font-bold tracking-[.08em] uppercase transition-colors", lead.done ? "text-muted hover:text-paper" : "text-faint hover:text-paper")}>
        {lead.done ? "Вернуть" : "Обработана"}
      </button>
    </div>
  );
}

/** Заявка списком — на телефоне вместо таблицы: горизонтальная прокрутка прячет контакт и кнопки. */
function LeadCard({ lead, onToggle }: { lead: Lead; onToggle: (lead: Lead) => void }) {
  return (
    <li className={cn("border-b border-line px-5 py-4 last:border-0", lead.done && "opacity-45")}>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-paper">{FORM_TITLE[lead.form] ?? lead.form}</span>
        <span className="ml-auto text-[11px] text-faint">{fmtTime(lead.at)}</span>
      </div>
      <div className="mt-2 space-y-0.5">
        {lead.rows.map((r) => (
          <div key={r.label} className="text-[13px] text-paper-dim">
            <span className="text-faint">{r.label}:</span> <span className="font-bold text-paper">{r.value}</span>
          </div>
        ))}
      </div>
      <div className={cn(LABEL, "mt-2")}>
        {lead.lang.toUpperCase()}
        {lead.country && ` · ${lead.country}`} · {lead.page.replace(/^https?:\/\/[^/]+/, "") || "/"}
      </div>
      {!lead.delivered && <div className="mt-1.5 text-[10px] font-bold tracking-[.12em] text-error uppercase">не дошла в Telegram</div>}
      <div className="mt-3">
        <Actions lead={lead} onToggle={onToggle} />
      </div>
    </li>
  );
}

/** Страница «Заявки»: таблица с формы, отметка «обработана». */
export function AdminLeads({ leads, onToggle }: { leads: Lead[]; onToggle: (lead: Lead) => void }) {
  return (
    <section className={cn(CARD, "overflow-hidden")}>
      {leads.length === 0 ? (
        <Empty text="Заявок пока нет" />
      ) : (
        <>
          <ul className="lg:hidden">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onToggle={onToggle} />
            ))}
          </ul>
          <div className="max-lg:hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-line">
                {["Когда", "Форма", "Поля", "Откуда", ""].map((h) => (
                  <th key={h} className={cn(LABEL, "px-5 py-4")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                return (
                  <tr key={lead.id} className={cn("border-b border-line align-top transition-colors hover:bg-panel-soft", lead.done && "opacity-45")}>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-paper">{fmtTime(lead.at)}</div>
                      <div className={cn(LABEL, "mt-1.5")}>
                        {lead.lang.toUpperCase()}
                        {lead.country && ` · ${lead.country}`}
                      </div>
                      {!lead.delivered && <div className="mt-1.5 text-[10px] font-bold tracking-[.12em] text-error uppercase">не дошла в Telegram</div>}
                    </td>
                    <td className="px-5 py-4 font-bold whitespace-nowrap text-paper">{FORM_TITLE[lead.form] ?? lead.form}</td>
                    <td className="px-5 py-4">
                      {lead.rows.map((r) => (
                        <div key={r.label} className="text-paper-dim">
                          <span className="text-faint">{r.label}:</span> <span className="font-bold text-paper">{r.value}</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-[11px] text-faint">
                      <div>{lead.page.replace(/^https?:\/\/[^/]+/, "") || "/"}</div>
                      {lead.source.map((s) => (
                        <div key={s}>{plain(s)}</div>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end">
                        <Actions lead={lead} onToggle={onToggle} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </>
      )}
    </section>
  );
}
