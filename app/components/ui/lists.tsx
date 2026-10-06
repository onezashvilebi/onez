import type { ReactNode } from "react";
import { Icon, isIconName } from "./icons";
import { cn } from "~/lib/cn";
import { useI18n } from "~/i18n/context";
import { pad2 } from "~/lib/format";
import { CardIndex, T } from "./primitives";

/** Бирюзовый порядковый номер в Timeline и Checklist. */
const Num = ({ i }: { i: number }) => <span className="font-display text-[13px] leading-[1.6] font-semibold text-teal">{pad2(i + 1)}</span>;

/** Таблица «параметр — значение». Значение — строка-пивот или готовый узел (ссылка). */
export function SpecList({ items, compact = false, reveal = true, className }: { items: [string, ReactNode][]; compact?: boolean; reveal?: boolean; className?: string }) {
  return (
    <dl className={cn("grid border-t border-line", compact ? "mt-[30px] sm:grid-cols-3" : "sm:grid-cols-2", reveal && "reveal", className)}>
      {items.map(([k, v]) => (
        <div key={k} className={cn("border-b border-line", compact ? "py-4 pr-5" : "py-[22px] pr-6")}>
          <T as="dt" className="mb-1.5 text-[10px] font-bold tracking-[.14em] text-muted uppercase">{k}</T>
          {typeof v === "string" ? <T as="dd" className="text-base font-semibold">{v}</T> : <dd className="text-base font-semibold [&_a]:text-teal">{v}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** Сравнительная таблица: первая строка — заголовки, первая колонка — названия строк. Настоящий <table>: его извлекают поиск и нейросети. */
export function CompareTable({ head, rows }: { head: string[]; rows: string[][] }) {
  const { t } = useI18n();
  // «—» не переводится: это знак, а не слово.
  const tr = (s: string) => (s === "—" ? s : t(s));
  return (
    <div className="mt-[30px] overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-y border-line">
            {head.map((h) => <th key={h} scope="col" className="py-3 pr-5 text-[10px] font-bold tracking-[.14em] text-muted uppercase">{tr(h)}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, ...cells]) => (
            <tr key={name} className="border-b border-line">
              <th scope="row" className="py-4 pr-5 text-base font-semibold">{tr(name!)}</th>
              {cells.map((c, i) => <td key={i} className={cn("py-4 pr-5 text-base", i === cells.length - 1 ? "font-semibold text-teal" : "text-muted")}>{tr(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Сетка фактов. Элемент: [заголовок, текст] или [значок, заголовок, текст]; значок — имя из icons.tsx или короткий текст («01», «К-1»). */
export function FeatureGrid({ items, cols = 4, icon = "diamond" }: { items: ([string, string] | [string, string, string])[]; cols?: 4 | 5; icon?: string }) {
  return (
    <div className={cn("reveal-stagger mt-[42px] grid grid-cols-1 border-y border-line sm:grid-cols-2", cols === 5 ? "sm:mt-[70px] tab:grid-cols-5" : "sm:mt-12 lg:grid-cols-4")}>
      {items.map((it) => {
        const [ic, title, text] = it.length === 3 ? it : [icon, ...it];
        return (
          <article key={title} className={cn("border-b border-l border-line px-5 py-[26px] last:border-r sm:px-[18px] sm:py-[34px]", cols === 5 ? "tab:min-h-[285px] tab:border-b-0 wide:px-7" : "lg:min-h-[220px] lg:border-b-0 wide:px-7")}>
            <span className="mb-7 grid size-[42px] place-items-center rounded-[1px] border border-current font-display text-sm leading-none font-medium text-teal sm:mb-[34px] tab:mb-[54px]">{isIconName(ic) ? <Icon name={ic} className="size-5" /> : <T>{ic}</T>}</span>
            <T as="h3" className="mb-3.5 font-display text-sm leading-[1.3] font-semibold tracking-[-.03em] uppercase">{title}</T>
            <T as="p" className="text-xs leading-[1.6] text-muted">{text}</T>
          </article>
        );
      })}
    </div>
  );
}

/** Две карточки: проблема и ответ (вторая выделена). */
export function PainAnswer({ first, second, className = "reveal-stagger" }: { first: [string, string]; second: [string, string]; className?: string }) {
  return (
    <div className={cn("grid border border-line sm:grid-cols-2", className)}>
      {[first, second].map(([label, text], i) => (
        <article key={label} className={cn("border-t border-line px-[30px] py-[34px] first:border-t-0 sm:border-t-0 sm:border-l sm:first:border-l-0", i === 1 && "bg-panel-soft")}>
          <CardIndex>{label}</CardIndex>
          <T as="p" className="mt-[18px] text-[17px] leading-[1.6] [&_b]:font-semibold">{text}</T>
        </article>
      ))}
    </div>
  );
}

/** Нумерованная шкала. Элемент — строка или [заголовок, пояснение]. */
export function Timeline({ items }: { items: (string | [string, string])[] }) {
  return (
    <ol className="reveal border-t border-line">
      {items.map((it, i) => (
        <li key={typeof it === "string" ? it : it[0]} className="grid grid-cols-[56px_1fr] gap-[18px] border-b border-line py-5 text-base font-semibold">
          <Num i={i} />
          {typeof it === "string" ? (
            <T>{it}</T>
          ) : (
            <div className="text-[15px] font-normal text-muted">
              <T as="b" className="mb-1 block text-base font-semibold text-paper">{it[0]}</T>
              <T as="p">{it[1]}</T>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Сетка нумерованных пунктов с h3. */
export function Checklist({ items }: { items: [string, string][] }) {
  return (
    <ol className="mt-[54px] grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([title, text], i) => (
        <li key={title} className="reveal grid grid-cols-[40px_1fr] gap-3.5 border-r border-b border-line px-6 py-[26px]">
          <Num i={i} />
          <div>
            <T as="h3" className="mb-2 font-display text-[15px] leading-[1.3] font-semibold tracking-[-.03em] uppercase">{title}</T>
            <T as="p" className="text-sm leading-[1.55] text-muted">{text}</T>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Аккордеон вопросов на <details>; первый открыт. Работает без JS. */
export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="reveal">
      {items.map(([q, a], i) => (
        <details key={q} open={i === 0} className="group border-t border-line last:border-b">
          <summary className="relative cursor-pointer list-none py-5 pr-10 text-base leading-[1.35] font-semibold [&::-webkit-details-marker]:hidden">
            <T>{q}</T>
            <Icon name="plus" className="absolute top-1/2 right-1 size-5 -translate-y-1/2 text-teal transition-transform group-open:rotate-45" />
          </summary>
          {/* Класс faq-answer — якорь speakable в JSON-LD (свод v3, правило 24). */}
          <T as="p" className="faq-answer mb-[22px] max-w-[640px] text-[15px] leading-[1.6] text-paper-dim">{a}</T>
        </details>
      ))}
    </div>
  );
}

/** Карточки обязательств (или сегментов), средняя выделена. */
export function PromiseGrid({ items }: { items: { title: string; text: ReactNode }[] }) {
  return (
    <div className="reveal-stagger mt-[42px] grid border-y border-line sm:mt-16 tab:grid-cols-3">
      {items.map((it, i) => (
        <article key={it.title} className={cn("relative isolate flex flex-col border-x border-line p-[30px] tab:min-h-[390px] tab:border-l-0 tab:px-[clamp(24px,3vw,44px)] tab:pt-8 tab:pb-9 tab:first:border-l", i === 1 && "bg-ink before:pointer-events-none before:absolute before:-inset-px before:border before:border-teal")}>
          {/* Номер карточки — крупной контурной цифрой за текстом, как .control-blueprint. */}
          <span aria-hidden="true" className="pointer-events-none absolute top-3 right-4 -z-1 font-display text-[clamp(130px,14vw,210px)] leading-[.8] font-bold tracking-[-.08em] text-transparent opacity-25 select-none [-webkit-text-stroke:1px_var(--color-teal)]">{pad2(i + 1)}</span>
          <T as="h3" className="mt-[88px] mb-[18px] font-display text-[clamp(24px,2vw,30px)] leading-[1.25] font-medium tracking-[-.04em] uppercase sm:mt-[110px] tab:mt-auto tab:mb-6">{it.title}</T>
          <div className="text-[15px] leading-[1.7] text-muted tab:min-h-[76px] [&_b]:font-semibold [&_b]:text-paper [&_p+p]:mt-3">{typeof it.text === "string" ? <T as="p">{it.text}</T> : it.text}</div>
        </article>
      ))}
    </div>
  );
}

/** Карточки команды: инициалы вместо фото (пока люди не подтверждены), имя, роль, зона ответственности, стаж. */
export function TeamGrid({ items }: { items: { name: string; role: string; text: string; years: string; photo?: string }[] }) {
  const { t } = useI18n();
  return (
    <div className="reveal-stagger mt-[42px] grid grid-cols-1 border-t border-l border-line sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m) => (
        <article key={m.name} className="flex flex-col border-r border-b border-line px-5 py-[26px] sm:px-[18px] sm:py-[34px] wide:px-7">
          {m.photo ? (
            <img src={m.photo} alt={`${t(m.name)} — ${t(m.role)}, ONEZA Construction`} width={256} height={256} loading="lazy" decoding="async" className="mb-7 size-24 rounded-full border border-line object-cover" />
          ) : (
            <span aria-hidden="true" className="mb-7 grid size-16 place-items-center rounded-full border border-teal font-display text-xl leading-none font-medium text-teal">
              {t(m.name).split(/\s+/).map((w) => w[0]).join("").slice(0, 2)}
            </span>
          )}
          <T as="h3" className="font-display text-base leading-[1.3] font-semibold tracking-[-.03em] uppercase">{m.name}</T>
          <T as="p" className="mt-1.5 text-[11px] font-bold tracking-[.08em] text-teal uppercase">{m.role}</T>
          <T as="p" className="mt-4 text-xs leading-[1.6] text-muted">{m.text}</T>
          <T as="p" className="mt-auto pt-5 text-[10px] text-muted uppercase">{m.years}</T>
        </article>
      ))}
    </div>
  );
}

/** Три крупных числа компании. */
export function AboutFacts({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-[42px] grid grid-cols-3 gap-2 border-y border-line py-7 sm:gap-4">
      {items.map(([n, label]) => (
        <div key={label} className="flex flex-col">
          <strong className="font-display text-[30px] leading-none font-medium tracking-[-.07em] sm:text-[clamp(32px,3.2vw,48px)]">{n}</strong>
          <T className="mt-2 text-[9px] leading-[1.4] text-muted uppercase">{label}</T>
        </div>
      ))}
    </div>
  );
}

/** Четыре шага расчёта на медной секции (или на тёмной — tone="dark"). */
export function CalcSteps({ items, tone = "copper" }: { items: string[]; tone?: "copper" | "dark" }) {
  return (
    <ol className={cn("grid grid-cols-2 gap-y-5 border-t sm:grid-cols-4 sm:gap-y-0", tone === "copper" ? "mt-[42px] border-ink-deep/40" : "mt-9 border-line text-paper")}>
      {items.map((s, i) => (
        <li key={s} className={cn("relative pt-[22px] pr-2.5 text-[10px] font-bold uppercase before:absolute before:-top-1 before:left-0 before:size-[7px] before:rounded-full", tone === "copper" ? "before:bg-ink" : "before:bg-teal")}>
          <span className="mb-[5px] block text-[9px] opacity-60">{pad2(i + 1)}</span>
          <T>{s}</T>
        </li>
      ))}
    </ol>
  );
}
