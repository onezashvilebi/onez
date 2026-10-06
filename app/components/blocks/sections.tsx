// Готовые секции, которые повторяются на нескольких страницах.
import { Icon } from "~/components/ui/icons";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { AboutFacts, CompareTable, Faq, FeatureGrid, PromiseGrid } from "~/components/ui/lists";
import { ButtonLink, CardIndex, Eyebrow, T, TextLink } from "~/components/ui/primitives";
import { H2, STAGE_TEXT, Section, SectionHead, SplitSection, TitledSection, type SectionBg } from "~/components/ui/section";
import { CONTROL, DIRECTIONS, FACTS, PROMISE, SITE_NOW } from "~/content/company";
import { CENA_STAGES } from "~/content/pages/cena";
import { CENA_TABLE } from "~/content/pages/misc";
import { USLUGI_AUDIENCE } from "~/content/pages/uslugi";
import { MONOLITH } from "~/content/services";
import { useScrollSpy } from "~/hooks/layout";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";
import { articlesBySlugs } from "~/logic/articles";
import { relatedServices } from "~/logic/service";

/** Обязательство по цене и срокам: три карточки и ссылка на манифест. prices — таблица стадий (правило 15). */
export function FixedPriceSection({ title = "Изменится ли цена<br><em>во время стройки?</em>", bg = "dark", size = "sm", id, rule = false, prices = false }: { title?: string; bg?: SectionBg; size?: "sm" | "lg"; id?: string; rule?: boolean; prices?: boolean }) {
  return (
    <TitledSection bg={bg} id={id} className={cn(rule && "top-rule")} eyebrow="Наше обязательство" title={title} size={size}>
      <PromiseGrid items={PROMISE.map(([title, text]) => ({ title, text }))} />
      {prices && (
        <>
          <T as="p" className="mt-12 max-w-[720px] text-[15px] leading-[1.7] text-muted">{CENA_STAGES.prices.text}</T>
          <CompareTable head={CENA_TABLE.head} rows={CENA_TABLE.rows} />
        </>
      )}
      <TextLink to="cena">Как работает фиксация</TextLink>
    </TitledSection>
  );
}

/** Вопросы и ответы: заголовок слева, аккордеон справа. */
export function FaqSection({ items, eyebrow = "Вопросы", title = "Коротко<br><em>о главном</em>", bg = "dark", id }: { items: [string, string][]; eyebrow?: string; title?: string; bg?: SectionBg; id?: string }) {
  return (
    <SplitSection bg={bg} id={id} eyebrow={eyebrow} title={title}>
      <Faq items={items} />
    </SplitSection>
  );
}

/** Три направления: жилые, производство, частные дома. details — подпись к каждому. */
export function DirectionGrid({ details }: { details: [string, string, string] }) {
  const { t, href } = useI18n();
  return (
    <div className="reveal-stagger mt-[42px] grid gap-4 sm:mt-[62px] tab:grid-cols-3">
      {DIRECTIONS.map((d, i) => (
        <Link key={d.slug} to={href(d.slug)} className="group relative isolate block h-[420px] overflow-hidden border border-line bg-panel-soft before:absolute before:inset-x-0 before:top-0 before:z-4 before:h-[3px] before:origin-left before:scale-x-0 before:bg-teal before:transition-transform before:duration-450 hover:before:scale-x-100 sm:h-[430px] tab:h-[560px]">
          {/* Фото — <img loading="lazy">, а не фон: фон CSS качается сразу, даже ниже первого экрана (ONEZ-22). */}
          <div aria-hidden="true" className={cn("direction-art absolute inset-0 transition-transform duration-700 ease-(--ease-build) group-hover:scale-[1.04]", `direction-${d.cat}`)}>
            <img src={`/assets/hero-${d.cat}.webp`} srcSet={`/assets/hero-${d.cat}-m.webp 820w, /assets/hero-${d.cat}.webp 1600w`} sizes="(min-width: 1024px) 33vw, 100vw" alt="" width={1600} height={900} loading="lazy" decoding="async" />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-3 p-[25px] sm:p-8">
            <T as="p" className="mb-2.5 text-[11px] text-muted">{d.who}</T>
            <T as="h3" className="font-display text-[clamp(24px,2.2vw,34px)] leading-[1.15] font-semibold tracking-[-.04em] uppercase">{d.title}</T>
            <div className="mt-[18px] grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity,margin] duration-450 tab:mt-0 tab:grid-rows-[0fr] tab:opacity-0 tab:group-hover:mt-6 tab:group-hover:grid-rows-[1fr] tab:group-hover:opacity-100">
              <div className="overflow-hidden">
                <T as="p" className="text-[13px] leading-[1.55] text-muted">{details[i]!}</T>
                <span className="mt-4 flex items-center gap-1.5 text-xs font-bold text-teal">{t("Подробнее")}<Icon name="arrow-up-right" className="size-3.5" /></span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** Открытость процесса для заказчика: пять фактов контроля. */
export function ControlSection({ bg = "panel", size = "sm" }: { bg?: SectionBg; size?: "sm" | "lg" }) {
  return (
    <Section bg={bg} className="isolate">
      <div aria-hidden="true" className="control-blueprint">ONEZA</div>
      <SectionHead eyebrow="Контроль" title="Вы видите<br><em>каждый этап</em>" intro="Процесс открыт заказчику: решения, сроки, акты и движение сметы приходят в общий чат объекта без запроса менеджеру." size={size} />
      <FeatureGrid items={CONTROL} cols={5} />
    </Section>
  );
}

/** Полоса-призыв между секциями. children — свой текст слева вместо одного заголовка. */
export function CtaBand({ title, to, label, variant = "copper", id, children }: { title?: string; to: string; label: string; variant?: "copper" | "outline"; id?: string; children?: ReactNode }) {
  return (
    <section id={id} className="relative overflow-hidden bg-panel py-[clamp(60px,7vw,96px)]">
      <div className="container-site reveal flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
        {children ?? <H2 size="band">{title ?? ""}</H2>}
        <ButtonLink to={to} variant={variant} arrow="up">{label}</ButtonLink>
      </div>
    </section>
  );
}

/** «Сейчас строим»: датированные фото действующей площадки (данные — SITE_NOW). */
export function SiteNowSection({ bg = "dark", id }: { bg?: SectionBg; id?: string }) {
  const { t } = useI18n();
  return (
    <TitledSection bg={bg} id={id} eyebrow={SITE_NOW.eyebrow} title={SITE_NOW.title} intro={SITE_NOW.intro}>
      <div className="reveal-stagger mt-[42px] grid gap-4 sm:mt-[62px] sm:grid-cols-2 tab:grid-cols-4">
        {SITE_NOW.photos.map((p) => (
          <figure key={p.file} className="m-0">
            <img
              src={`/assets/${p.file}.webp`}
              srcSet={`/assets/${p.file}-820.webp 820w, /assets/${p.file}.webp 1200w`}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              alt={t(p.alt)}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-4/3 w-full border border-line object-cover"
            />
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 text-[11px] tracking-[.06em] text-muted uppercase">
              <T>{p.stage}</T>
              <time dateTime={p.date}>{p.date.split("-").reverse().join(".")}</time>
            </figcaption>
          </figure>
        ))}
      </div>
    </TitledSection>
  );
}

/** Фото основателя на площадке + текст о компании. */
export function AboutBlock({ eyebrow, title, lead, text, caption, photoLabel, link, bg = "dark" }: { eyebrow: string; title: string; lead: string; text: string; caption: string; photoLabel: string; link?: [string, string]; bg?: SectionBg }) {
  const { t } = useI18n();
  return (
    <Section bg={bg} containerClassName="grid items-center gap-11 sm:grid-cols-2 sm:gap-[6%] tab:grid-cols-[6fr_5fr] tab:gap-[8.333%]">
      <div className="reveal">
        <div className="about-photo">
          {/* Фото — <img>, а не фон: Google Картинки фоновые изображения не
              индексируют, а alt переводится словарём (ONEZ-53). srcset даёт
              телефону 560 px вместо полного кадра 1122 px. */}
          <img
            src="/assets/about-founder-krtsanisi.webp"
            srcSet="/assets/about-founder-krtsanisi-560.webp 560w, /assets/about-founder-krtsanisi-820.webp 820w, /assets/about-founder-krtsanisi.webp 1122w"
            sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
            alt={t(photoLabel)}
            width={1122}
            height={1402}
            loading="lazy"
            decoding="async"
          />
          <i className="crosshair" />
        </div>
        <p className="mt-3 text-[10px] text-muted">{t(caption)}</p>
      </div>
      <div className="reveal">
        <Eyebrow>{eyebrow}</Eyebrow>
        <H2 size="about">{title}</H2>
        <T as="p" className="mt-[38px] mb-[22px] text-[clamp(18px,1.6vw,22px)] leading-[1.55] text-paper">{lead}</T>
        <T as="p" className="text-[15px] leading-[1.75] text-muted">{text}</T>
        <AboutFacts items={FACTS} />
        {link && <TextLink to={link[0]} align="start" reveal={false}>{link[1]}</TextLink>}
      </div>
    </Section>
  );
}

type LinkCard = { slug: string; tag: string; title: string; text: string };

/** Сетка карточек-ссылок: метка, заголовок, текст, «Подробнее» со стрелкой. Общая для статей и монолитных работ. */
function LinkCardGrid({ items, more }: { items: LinkCard[]; more: string }) {
  const { t, href } = useI18n();
  return (
    <div className="reveal-stagger mt-9 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] border-t border-l border-line sm:mt-[54px]">
      {items.map((c) => (
        <Link key={c.slug} to={href(c.slug)} className="flex flex-col border-r border-b border-line px-7 py-[30px] transition-colors duration-300 hover:bg-panel-soft sm:min-h-[280px]">
          <CardIndex>{c.tag}</CardIndex>
          <h3 className="mt-auto mb-3.5 pt-10 font-display text-[clamp(19px,1.6vw,24px)] leading-[1.25] font-medium tracking-[-.04em] uppercase">{t(c.title)}</h3>
          <p className="text-sm leading-[1.6] text-muted">{t(c.text)}</p>
          <span className="mt-[22px] flex items-center gap-1.5 text-xs font-bold text-teal">{t(more)}<Icon name="arrow-up-right" className="size-3.5" /></span>
        </Link>
      ))}
    </div>
  );
}

/** Карточки статей; slugs — какие показать (по умолчанию все). */
export function ArticleGrid({ slugs }: { slugs?: string[] }) {
  return <LinkCardGrid more="Читать" items={articlesBySlugs(slugs).map((a) => ({ slug: a.slug, tag: a.tag, title: a.name, text: a.text }))} />;
}

/** Монолитные работы отдельным этапом: карточки подпорных стен и фундаментов. */
export function MonolithGrid() {
  return <LinkCardGrid more="Подробнее" items={MONOLITH.map((m) => ({ slug: m.slug, tag: m.eyebrow, title: m.name!, text: m.card! }))} />;
}

/** «Смежные услуги» (ONEZ-53): услуга → смежные услуги, единый источник — RELATED_SERVICES. Без кнопки (закон 6). */
export function RelatedServices({ slug, bg = "panel" }: { slug: string; bg?: SectionBg }) {
  const items = relatedServices(slug);
  if (!items.length) return null;
  return (
    <TitledSection bg={bg} eyebrow="Смежные услуги" title="Смежные<br><em>услуги</em>">
      <LinkCardGrid more="Подробнее" items={items.map((s) => ({ slug: s.slug, tag: s.eyebrow, title: s.name!, text: s.card! }))} />
      <TextLink to="uslugi">Все услуги</TextLink>
    </TitledSection>
  );
}

/** Вход по аудитории: карточки посадочных под направления (content/pages/uslugi.ts). */
export function AudienceSection({ bg = "dark" }: { bg?: SectionBg }) {
  return (
    <TitledSection bg={bg} eyebrow={USLUGI_AUDIENCE.eyebrow} title={USLUGI_AUDIENCE.title} intro={USLUGI_AUDIENCE.intro}>
      <LinkCardGrid more="Подробнее" items={USLUGI_AUDIENCE.cards} />
    </TitledSection>
  );
}

export function MonolithSection({ bg = "panel" }: { bg?: SectionBg }) {
  return (
    <TitledSection bg={bg} eyebrow="Монолитные работы" title="Отдельным<br><em>этапом</em>" intro="Когда нужен не весь цикл, а конкретная конструкция: стена на склоне или фундамент под ваш проект.">
      <MonolithGrid />
    </TitledSection>
  );
}

/** «Статьи по теме» — ставится перед ContactSection. */
export function RelatedArticles({ slugs, bg = "panel", title = "Разобрать<br><em>подробнее</em>", services = [] }: { slugs: string[]; bg?: SectionBg; title?: string; services?: [string, string][] }) {
  return (
    <TitledSection bg={bg} eyebrow="Статьи" title={title}>
      <ArticleGrid slugs={slugs} />
      {/* Статья → услуги по теме: перелинковка для поиска (ONEZ-53). */}
      {services.map(([to, label]) => (
        <TextLink key={to} to={to} align="start">{label}</TextLink>
      ))}
      <TextLink to="stati">Все статьи</TextLink>
    </TitledSection>
  );
}

/** Текстовая страница: липкое оглавление слева, разделы-этапы справа. */
export function PageLayout({ nav, navTitle, children }: { nav: [string, string][]; navTitle: string; children: ReactNode }) {
  return (
    <Section bg="panel" layout="page">
      <SideNav items={nav} title={navTitle} />
      {/* min-w-0: иначе широкая таблица раздвигает колонку сетки вместо своей прокрутки. */}
      <div className="min-w-0">{children}</div>
    </Section>
  );
}

function SideNav({ items, title }: { items: [string, string][]; title: string }) {
  const { t } = useI18n();
  const current = useScrollSpy(items.map(([id]) => id));
  return (
    <aside className="reveal lg:sticky lg:top-[100px]">
      <p className="mb-4 text-[10px] font-bold tracking-[.16em] text-muted uppercase">{t(title)}</p>
      <nav className="flex flex-row flex-wrap gap-x-[18px] gap-y-1 lg:flex-col lg:gap-0 lg:border-l lg:border-line">
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={current === id ? "location" : undefined} className="border-b-2 border-transparent py-1.5 text-[13px] font-semibold text-paper/85 transition-colors hover:border-teal hover:text-teal aria-[current]:border-teal aria-[current]:text-teal lg:-ml-px lg:border-b-0 lg:border-l-2 lg:py-2.5 lg:pl-5">
            {t(label)}
          </a>
        ))}
      </nav>
    </aside>
  );
}

/** Раздел текстовой страницы с номером и h2. */
export function Stage({ n, title, id, text, children, className }: { n: string; title: string; id?: string; text?: string; children?: ReactNode; className?: string }) {
  return (
    <article id={id} className={cn("reveal scroll-mt-[100px] border-t border-line py-[54px] first:border-t-0 first:pt-0", className)}>
      <div className="flex items-baseline gap-[26px]">
        <span className="font-display text-sm leading-none font-semibold text-teal">{n}</span>
        <H2 className="text-[clamp(26px,2.6vw,40px)]!">{title}</H2>
      </div>
      {text && <T as="p" className={STAGE_TEXT}>{text}</T>}
      {children}
    </article>
  );
}
