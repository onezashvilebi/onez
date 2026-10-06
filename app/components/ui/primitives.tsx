import { createElement, type ElementType, type ReactNode } from "react";
import { Icon } from "./icons";
import { Link } from "react-router";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";
import { CHANNELS, FACEBOOK_RU, type Channel } from "~/site/contacts";

/**
 * Строка-пивот (по-русски) → перевод на языке страницы. Разметка <br>/<em>/<b>
 * внутри строки сохраняется, поэтому рендер через innerHTML: источник — наши
 * словари, не пользовательский ввод.
 */
export function T({ as = "span", children, className, id }: { as?: ElementType; children: string; className?: string; id?: string }) {
  const { t } = useI18n();
  return createElement(as, { className, id, dangerouslySetInnerHTML: { __html: t(children) } });
}

const EXTERNAL = /^(?:https?:|tel:|mailto:)/;

/** Ссылка на страницу сайта по slug («kontakty#form») или внешний адрес (http — в новой вкладке). */
export function SmartLink({ to, className, children, ariaLabel }: { to: string; className?: string; children: ReactNode; ariaLabel?: string }) {
  const { href } = useI18n();
  if (EXTERNAL.test(to) || to.startsWith("#")) {
    const blank = to.startsWith("http") ? { target: "_blank", rel: "noopener" } : {};
    return <a href={to} {...blank} aria-label={ariaLabel} className={className}>{children}</a>;
  }
  return <Link to={href(to)} className={className} aria-label={ariaLabel}>{children}</Link>;
}

/** Телефон, почта или мессенджер компании. Без children подпись — сам контакт. */
export function ContactLink({ channel, className, ariaLabel, children }: { channel: Channel; className?: string; ariaLabel?: string; children?: ReactNode }) {
  const { lang } = useI18n();
  const c = CHANNELS[channel];
  const to = channel === "facebook" && lang === "ru" ? FACEBOOK_RU : c.href;
  return <SmartLink to={to} className={className} ariaLabel={ariaLabel}>{children ?? c.label}</SmartLink>;
}

export type ButtonVariant = "copper" | "ghost" | "outline" | "ink";
export type ButtonSize = "md" | "sm";

const BUTTON_BASE = "inline-flex min-h-14 items-center justify-center gap-5 rounded-[1px] border border-transparent px-7 text-[13px] leading-tight font-bold transition-[color,background-color,border-color,translate] duration-250 hover:-translate-y-0.5 cursor-pointer";
const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  // Медная — только главное действие, одна на экран (закон 6). Текст тёмный:
  // белый на меди даёт 3,5:1, графит — 5,6:1 (норма WCAG AA — 4,5:1).
  copper: "bg-copper text-ink-deep hover:bg-copper-light",
  ghost: "border-white/40 bg-ink/10 hover:border-paper hover:bg-white/5",
  outline: "border-teal text-teal hover:bg-teal hover:text-ink",
  ink: "w-full bg-ink text-paper hover:bg-panel",
};

export function buttonClass(variant: ButtonVariant = "copper", size: ButtonSize = "md", className?: string) {
  return cn(BUTTON_BASE, BUTTON_VARIANT[variant], size === "sm" && "min-h-11 px-5 text-[11px]", className);
}

/** Стрелка после текста кнопки: up — к результату или наружу, right — дальше по сайту. */
export const Arrow = ({ dir = "up" }: { dir?: "up" | "right" }) => <Icon name={dir === "up" ? "arrow-up-right" : "arrow-right"} />;

/** Кнопка-ссылка. Текст называет результат: «Получить расчёт», не «Отправить». */
export function ButtonLink({ to, children, variant = "copper", size = "md", arrow, className }: { to: string; children: string; variant?: ButtonVariant; size?: ButtonSize; arrow?: "up" | "right"; className?: string }) {
  const { t } = useI18n();
  return (
    <SmartLink to={to} className={buttonClass(variant, size, className)}>
      {t(children)}
      {arrow && <Arrow dir={arrow} />}
    </SmartLink>
  );
}

export function TextLink({ to, children, align = "end", reveal = true, className }: { to: string; children: string; align?: "start" | "end"; reveal?: boolean; className?: string }) {
  const { t } = useI18n();
  return (
    <SmartLink to={to} className={cn("group mt-[34px] flex w-max items-center gap-[38px] text-xs font-bold text-teal", align === "end" && "ml-auto", reveal && "reveal", className)}>
      <span dangerouslySetInnerHTML={{ __html: t(children) }} />
      <Icon name="arrow-right" className="transition-transform duration-250 group-hover:translate-x-[7px]" />
    </SmartLink>
  );
}

export function Eyebrow({ children, tone = "teal", className }: { children: string; tone?: "teal" | "ink"; className?: string }) {
  return (
    <p className={cn("mb-[18px] flex items-center gap-3 text-[10px] font-bold tracking-[.16em] uppercase sm:mb-6", tone === "ink" ? "text-ink" : "text-teal", className)}>
      <span aria-hidden="true" className="h-px w-8 bg-current" />
      <T>{children}</T>
    </p>
  );
}

export function CardIndex({ children, className }: { children: string; className?: string }) {
  return <T className={cn("font-body text-[10px] leading-none font-bold tracking-[.15em] text-teal", className)}>{children}</T>;
}

/** Факт или оговорка рядом с текстом. */
export function FactNote({ label, children }: { label: string; children: string }) {
  return (
    <aside className="mt-[34px] max-w-[720px] border-l-3 border-teal bg-panel-soft px-[26px] py-6">
      <CardIndex>{label}</CardIndex>
      <T as="p" className="mt-2.5 text-sm leading-[1.7] text-paper-dim">{children}</T>
    </aside>
  );
}

/** Строка «i  Отделочный ремонт не выполняем…» под списком этапов. */
export function Disclaimer({ children }: { children: string }) {
  return (
    <p className="reveal mt-[34px] text-[13px] text-muted">
      <Icon name="info" className="mr-2.5 size-[22px] align-[-6px] text-teal" />
      <T>{children}</T>
    </p>
  );
}
