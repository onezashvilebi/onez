import { useId, type RefObject } from "react";
import { Icon } from "~/components/ui/icons";
import { CalcSteps } from "~/components/ui/lists";
import { Arrow, ContactLink, Eyebrow, T, buttonClass } from "~/components/ui/primitives";
import { H2 } from "~/components/ui/section";
import type { Field, FormConfig, FormVariant } from "~/content/forms";
import { useLeadForm } from "~/hooks/useLeadForm";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";
import type { LeadRow } from "~/logic/lead";

const INPUT = "h-14 w-full rounded-none border bg-ink px-4 text-[14px] text-paper outline-none transition-colors placeholder:text-faint focus:border-teal";
const CAPTION = "text-[10px] font-bold tracking-[.1em] text-muted uppercase";

function FormField({ field: f, id, invalid, defaultValue, onInput }: { field: Field; id: string; invalid: boolean; defaultValue: string; onInput: () => void }) {
  const { t } = useI18n();
  const common = { id, name: f.name, required: !!f.required, "aria-invalid": invalid || undefined, "aria-describedby": invalid ? `${id}-error` : undefined, onInput, className: cn(INPUT, invalid ? "border-error" : "border-field") };
  return (
    <div>
      <label htmlFor={id} className={cn(CAPTION, "mb-2 block")}>{t(f.label)}</label>
      {f.options ? (
        // value — уже переведённый текст (закон 2: страница ka/en не хранит кириллицу
        // в разметке); leadRows() отдаёт его как есть, лишний t() на экране заявки его не портит.
        <select {...common} defaultValue={t(defaultValue)}>
          {f.placeholder !== undefined && <option value="">{t(f.placeholder)}</option>}
          {f.options.map((o) => <option key={o} value={t(o)}>{t(o)}</option>)}
        </select>
      ) : (
        <input {...common} placeholder={t(f.placeholder ?? "")} inputMode={f.inputMode} autoComplete={f.autoComplete} />
      )}
      {invalid && f.required && <span id={`${id}-error`} className="mt-1.5 block text-[11px] text-error">{t(f.required)}</span>}
    </div>
  );
}

/** Экран после отправки: итог, что именно ушло, и следующий шаг. */
function LeadResult({ cfg, sent, rows, waLink, onReset, headingRef }: { cfg: FormConfig; sent: boolean; rows: LeadRow[]; waLink: string; onReset: () => void; headingRef: RefObject<HTMLHeadingElement | null> }) {
  const { t } = useI18n();
  const [title, text] = sent ? cfg.sent : cfg.fallback;
  return (
    <div aria-live="polite" className="grid gap-7">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className={cn("grid size-12 shrink-0 place-items-center rounded-[1px]", sent ? "bg-teal text-ink" : "border border-teal/50 text-teal")}>
          <Icon name={sent ? "check" : "chat"} className="size-6" />
        </span>
        <div className="min-w-0">
          <h3 ref={headingRef} tabIndex={-1} className="font-display text-[22px] leading-[1.15] font-semibold uppercase outline-none sm:text-[26px]">{t(title)}</h3>
          <p className="mt-2 max-w-[440px] text-[13px] leading-relaxed text-muted">{t(text)}</p>
        </div>
      </div>

      <div className="border border-line bg-ink/40">
        <p className={cn(CAPTION, "flex items-center justify-between border-b border-line px-4 py-3")}>
          {t("Ваша заявка")}
          <Icon name="document" className="size-4 text-faint" />
        </p>
        <dl className="divide-y divide-line">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 px-4 py-3.5 sm:grid-cols-[minmax(0,170px)_1fr] sm:gap-5">
              <dt className="text-[12px] text-muted">{t(r.label)}</dt>
              <dd className="text-[14px] font-semibold break-words text-paper">{t(r.value)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {sent && (
        <div>
          <p className={cn(CAPTION, "mb-3")}>{t("Что дальше")}</p>
          <ol className="grid gap-3">
            {cfg.next.map((step, i) => (
              <li key={step} className="flex items-baseline gap-3 text-[13px] text-paper-dim">
                <span className="font-display text-[11px] font-semibold text-teal">{String(i + 1).padStart(2, "0")}</span>
                {t(step)}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <a href={waLink} target="_blank" rel="noopener" className={buttonClass(sent ? "outline" : "ink", "sm", "w-full")}>
          {t(sent ? "Написать в WhatsApp" : cfg.fallback[2])} <Arrow />
        </a>
        <button type="button" onClick={onReset} className={buttonClass("ghost", "sm", "w-full")}>
          {t(sent ? "Отправить ещё одну" : "Изменить данные")}
        </button>
      </div>
    </div>
  );
}

/** Форма заявки: поля из content/forms.ts, поведение — useLeadForm. */
export function EstimateForm({ variant = "estimate", objtype = "" }: { variant?: FormVariant; objtype?: string }) {
  const { t } = useI18n();
  const uid = useId();
  const { cfg, invalid, status, rows, waLink, resultRef, onSubmit, clear, reset, defaultValue, privacy } = useLeadForm(variant, objtype);
  const sending = status === "sending";
  const done = status === "sent" || status === "fallback";

  return (
    <div id="form" className="reveal relative scroll-mt-24 bg-panel px-[18px] py-[26px] text-paper shadow-panel sm:p-[clamp(28px,4vw,48px)]">
      {/* Форма остаётся в DOM: «Изменить данные» возвращает к ней с введёнными значениями. */}
      <form noValidate onSubmit={onSubmit} hidden={done} aria-busy={sending} className="grid gap-5">
        <p className="flex items-center gap-3 text-[12px] leading-snug text-muted">
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-[1px] border border-teal/40 text-teal">
            <Icon name="chat" className="size-[18px]" />
          </span>
          {t("Два поля — и мы свяжемся с вами в течение рабочего часа")}
        </p>
        {cfg.fields.map((f) => (
          <FormField key={f.name} field={f} id={`${uid}-${f.name}`} invalid={invalid.has(f.name)} defaultValue={defaultValue(f)} onInput={() => clear(f.name)} />
        ))}
        {/* Ловушка для ботов: человек это поле не видит. */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={sending} className={buttonClass("ink", "md", "disabled:cursor-wait disabled:opacity-80")}>
          {sending ? (
            <>
              <span aria-hidden="true" className="size-3.5 animate-spin border-2 border-paper/30 border-t-paper" />
              {t("Отправляем…")}
            </>
          ) : (
            <>
              {t(cfg.submit)} <Arrow />
            </>
          )}
        </button>
        <p className="-mt-2 text-[10px] leading-relaxed text-faint [&_a]:underline [&_a]:underline-offset-3" dangerouslySetInnerHTML={{ __html: privacy }} />
      </form>

      {done && <LeadResult cfg={cfg} sent={status === "sent"} rows={rows} waLink={waLink} onReset={reset} headingRef={resultRef} />}
    </div>
  );
}

/** Медная секция заявки — последняя секция почти каждой страницы. */
export function ContactSection({
  title = "Получите расчёт<br><em>вашего объекта</em>",
  text = "Сначала разберём вводные. Затем предложим состав работ, реалистичный срок и порядок расчёта стоимости.",
  eyebrow = "Следующий шаг",
  steps = ["Вводные", "Проект", "Смета", "Фиксация"],
  languages,
  objtype,
  variant = "estimate",
}: { title?: string; text?: string; eyebrow?: string; steps?: string[]; languages?: string; objtype?: string; variant?: FormVariant }) {
  return (
    <section id="contact" className="top-rule section-y on-copper relative overflow-hidden bg-copper text-ink-deep [--rule:var(--color-ink)]">
      <div aria-hidden="true" className="contact-lines max-sm:hidden" />
      <div className="container-site relative grid items-center gap-14 tab:grid-cols-[5fr_6fr] tab:gap-[8.333%]">
        <div className="reveal">
          <Eyebrow tone="ink">{eyebrow}</Eyebrow>
          <H2 size="contact">{title}</H2>
          <T as="p" className="mt-7 max-w-[540px]">{text}</T>
          <p className="mt-7 flex flex-col gap-1.5">
            <ContactLink channel="phone" className="text-[28px] font-semibold tracking-[-.01em]" />
            <span className="text-[15px] opacity-75 [&_a]:underline [&_a]:underline-offset-3">
              <ContactLink channel="whatsapp" /> · <ContactLink channel="telegram" />
              {languages && ` · ${languages}`}
            </span>
          </p>
          <CalcSteps items={steps} />
        </div>
        <EstimateForm variant={variant} objtype={objtype} />
      </div>
    </section>
  );
}
