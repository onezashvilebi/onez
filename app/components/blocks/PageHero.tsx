import type { ReactNode } from "react";
import { preload } from "react-dom";
import { Link } from "react-router";
import { Eyebrow, T } from "~/components/ui/primitives";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";
import { formatInt } from "~/lib/format";
import { useCountUp } from "~/hooks/reveal";
import { modifiedFor } from "~/logic/modified";

/** Файлы фона героя: [десктоп, телефон ≤ 640 px] — те же, что в app.css (`.page-hero-image.*`). */
const HERO_FILES: Record<HeroImage | "default", [string, string]> = {
  default: ["onez-construction-hero.webp", "onez-construction-hero-page-m.webp"],
  residential: ["hero-residential.webp", "hero-residential-m.webp"],
  industrial: ["hero-industrial.webp", "hero-industrial-m.webp"],
  private: ["hero-private.webp", "hero-private-m.webp"],
  process: ["process-quality-control.webp", "process-quality-control-m.webp"],
  "site-check": ["hero-site-check.webp", "hero-site-check-m.webp"],
  "fixed-price": ["hero-fixed-price.webp", "hero-fixed-price-m.webp"],
};

/**
 * Фон героя — LCP внутренней страницы: без предзагрузки картинка находится только после
 * разбора CSS и ждёт скрипты (ONEZ-22: LCP 5,8–7,0 с). `preload()` React поднимает ссылку в
 * <head> пререндера. На телефоне у фона по умолчанию — квадратный кроп 560 px (27 КБ вместо 45).
 * Концепты объектов (img-a … img-f) не предзагружаются: у них нет мобильной версии.
 */
function useHeroPreload(image?: string) {
  const files = HERO_FILES[(image ?? "default") as HeroImage];
  if (!files) return;
  preload(`/assets/${files[1]}`, { as: "image", type: "image/webp", media: "(max-width: 640px)", fetchPriority: "high" });
  preload(`/assets/${files[0]}`, { as: "image", type: "image/webp", media: "(min-width: 641px)", fetchPriority: "high" });
}

/** Сюжет героя из библиотеки (DESIGN_SYSTEM.md) или концепт объекта (img-a … img-f). */
export type HeroImage = "residential" | "industrial" | "private" | "process" | "site-check" | "fixed-price";

export function Breadcrumbs({ items }: { items: [string | null, string][] }) {
  const { t, href } = useI18n();
  return (
    <nav aria-label={t("Хлебные крошки")} className="mb-[30px]">
      <ol className="flex flex-wrap gap-x-3.5 gap-y-2 text-[11px] font-semibold tracking-[.08em] text-muted uppercase">
        {items.map(([slug, label]) => (
          <li key={label} className="not-last:after:ml-3.5 not-last:after:opacity-45 not-last:after:content-['/']">
            {slug !== null ? <Link to={href(slug)} className="hover:text-teal">{t(label)}</Link> : <span aria-current="page" className="text-paper">{t(label)}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Counter({ to, space }: { to: number; space?: boolean }) {
  const { ref, value } = useCountUp(to);
  return <span ref={ref}>{space ? formatInt(value) : value}</span>;
}

export type Stat = { value: string; label: string; count?: number; space?: boolean };

/** Три крупных числа в герое; ниже 480 px — строками. */
export function HeroStats({ items, note, className }: { items: Stat[]; note?: ReactNode; className?: string }) {
  return (
    <div className={cn("relative grid grid-cols-1 border-t border-white/20 pt-[22px] xs:grid-cols-[repeat(3,auto)] xs:justify-between xs:gap-6 tab:gap-8 tab:pt-[30px]", note ? "tab:grid-cols-[repeat(3,auto)_1fr] tab:gap-[clamp(24px,5vw,72px)]" : undefined, className)}>
      {items.map((s) => (
        <div key={s.label} className="flex min-h-[58px] items-center gap-[18px] border-b border-white/10 py-2.5 xs:min-h-0 xs:flex-col xs:items-start xs:gap-2 xs:border-0 xs:py-0 tab:flex-row tab:items-end tab:gap-3">
          <strong className="w-[174px] flex-none font-display text-[34px] leading-[.9] font-medium tracking-[-.07em] xs:w-auto xs:text-[clamp(26px,6.4vw,36px)] sm:text-[clamp(36px,4vw,62px)]">
            {s.count !== undefined ? <Counter to={s.count} space={s.space} /> : s.value}
          </strong>
          <T className="text-[8px] leading-[1.35] text-muted uppercase sm:text-[10px]">{s.label}</T>
        </div>
      ))}
      {note}
    </div>
  );
}

// В Node при пререндере нет грузинской локали ICU — Intl отдаёт английский месяц,
// поэтому для ka месяц берётся из своего списка.
const KA_MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];

function formatDate(iso: string, lang: "ka" | "ru" | "en"): string {
  const d = new Date(iso);
  if (lang === "ka") return `${d.getUTCDate()} ${KA_MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

/**
 * «Обновлено: дата» (и дата публикации у статей) под лидом героя. Дата — правки
 * текста, не сборки; источник один на сайт — `logic/modified.ts`, та же дата
 * уходит в `dateModified` и в `lastmod` sitemap (свод v3, правило 22).
 */
export function UpdatedNote({ slug, published }: { slug: string; published?: string }) {
  const { t, lang } = useI18n();
  const date = modifiedFor(slug);
  if (!date) return null;
  return (
    <p className="mt-5 text-[12px] text-muted">
      {published && (
        <>
          <time dateTime={published} suppressHydrationWarning>{t("Опубликовано")}: {formatDate(published, lang)}</time>
          <span className="px-2 opacity-50">·</span>
        </>
      )}
      <time dateTime={date} suppressHydrationWarning>{t("Обновлено")}: {formatDate(date, lang)}</time>
    </p>
  );
}

const H1_SIZE = {
  md: "text-[clamp(30px,8.5vw,40px)] [overflow-wrap:anywhere] sm:text-[clamp(40px,5vw,80px)] sm:[overflow-wrap:normal]",
  long: "text-[clamp(24px,6.8vw,30px)] sm:text-[clamp(36px,4.3vw,70px)]",
  legal: "text-[clamp(20px,5.8vw,27px)] tracking-[-.07em] sm:text-[clamp(34px,4.1vw,66px)] sm:tracking-[-.055em]",
};

/** Герой внутренней страницы: крошки, надзаголовок, единственный h1, лид. */
export function PageHero({ eyebrow, title, lead, more, crumbs, image, titleSize = "md", children }: { eyebrow: string; title: string; lead?: string; more?: string; crumbs: [string | null, string][]; image?: HeroImage | string; titleSize?: keyof typeof H1_SIZE; children?: ReactNode }) {
  // hero-default — сюжет по умолчанию: свой класс, чтобы мобильное правило в app.css к нему применялось.
  const imageClass = image ? (image.startsWith("img-") ? image : `hero-${image}`) : "hero-default";
  useHeroPreload(image);
  return (
    <section className="relative flex min-h-[clamp(520px,62vh,680px)] overflow-hidden bg-ink-hero">
      <div aria-hidden="true" className={cn("page-hero-image", imageClass)} />
      <div aria-hidden="true" className="hero-grid" />
      <div className="container-site relative z-1 flex flex-col justify-end pt-[120px] pb-14 sm:pt-[150px]">
        <Breadcrumbs items={crumbs} />
        {/* Первый экран без .reveal: h1 — элемент LCP, он не должен ждать загрузки JS (ONEZ-22). */}
        <Eyebrow>{eyebrow}</Eyebrow>
        <T as="h1" className={cn("max-w-[980px] leading-[.98]", H1_SIZE[titleSize])}>{title}</T>
        {/* BLUF (свод v3, правило 12): прямой ответ с цифрами в первом абзаце, условия — во втором.
            Класс bluf — якорь speakable в JSON-LD (правило 24). */}
        {lead && <T as="p" className="bluf mt-[26px] w-full max-w-[620px] text-[15px] leading-[1.55] text-paper-dim sm:text-[clamp(16px,1.35vw,20px)]">{lead}</T>}
        {more && <T as="p" className="bluf mt-4 w-full max-w-[620px] text-[14px] leading-[1.6] text-muted sm:text-[15px]">{more}</T>}
        {children}
      </div>
    </section>
  );
}
